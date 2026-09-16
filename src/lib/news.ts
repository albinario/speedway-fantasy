'use server'

import Anthropic from '@anthropic-ai/sdk'
import Parser from 'rss-parser'

import { db } from './db'

const FEED_URLS = [
	'https://speedwayhub.com/feed/',
	'https://bestspeedwaytv.pl/feed/',
	'https://speedwaynews.pl/feed/'
]
const MAX_ITEMS_PER_FEED = 20

const FIM_SPEEDWAY_NEWS_URL = 'https://fimspeedway.com/en/sgp/news/1'
// fimspeedway.com's Cloudflare WAF blocks requests without a browser-like User-Agent.
const BROWSER_USER_AGENT =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

type FeedItem = {
	title?: string
	link?: string
	guid?: string
	pubDate?: string
	isoDate?: string
	contentSnippet?: string
	'content:encoded'?: string
}

type FimStory = {
	id: number
	title: string
	slug: string
	excerpt: string
	content: string
	publishedAt: string
}

const parser = new Parser<object, FeedItem>({
	customFields: { item: ['content:encoded'] }
})

async function fetchRssFeed(url: string): Promise<FeedItem[]> {
	const feed = await parser.parseURL(url)
	return feed.items.slice(0, MAX_ITEMS_PER_FEED)
}

// fimspeedway.com has no public API; this scrapes the __NEXT_DATA__ payload
// their news page hydrates from. The build ID in their _next/data/* URLs
// rotates on every deploy, so we fetch the rendered page instead, which
// always carries a matching build ID for whatever JSON it embeds.
async function fetchFimSpeedwayItems(): Promise<FeedItem[]> {
	const res = await fetch(FIM_SPEEDWAY_NEWS_URL, {
		headers: { 'User-Agent': BROWSER_USER_AGENT }
	})

	if (!res.ok) {
		throw new Error(`FIM Speedway news page returned ${res.status}`)
	}

	const html = await res.text()
	const match = html.match(
		/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
	)

	if (!match) {
		throw new Error('Could not find __NEXT_DATA__ on FIM Speedway news page')
	}

	const data = JSON.parse(match[1])
	const stories: FimStory[] = data?.props?.pageProps?.stories ?? []

	return stories.slice(0, MAX_ITEMS_PER_FEED).map((story) => ({
		title: story.title,
		link: `https://fimspeedway.com/news/${story.slug}`,
		guid: `fimspeedway-${story.id}`,
		// publishedAt has no timezone; treat as UTC rather than relying on
		// the runtime's implementation-defined parsing of a bare date string.
		isoDate: new Date(`${story.publishedAt.replace(' ', 'T')}Z`).toISOString(),
		contentSnippet: story.excerpt,
		'content:encoded': story.content
	}))
}

const anthropic = new Anthropic()

const CLASSIFY_TOOL: Anthropic.Tool = {
	name: 'classify_and_summarize',
	description:
		'Classify whether a speedway news article is specifically relevant to the FIM Speedway Grand Prix, and if so write a short headline and blurb.',
	strict: true,
	input_schema: {
		type: 'object',
		properties: {
			is_gp_relevant: {
				type: 'boolean',
				description:
					'True only if the article concerns FIM Speedway Grand Prix riders, GP rounds/venues/schedule, wildcards, injuries/call-ups affecting GP participation, or GP championship standings. False for general British league (SGB Premiership/Championship), other domestic speedway, or unrelated content.'
			},
			headline: {
				type: 'string',
				description:
					'A short, punchy headline under 80 characters, in a fan-friendly voice. Empty string if not relevant.'
			},
			blurb: {
				type: 'string',
				description:
					'A 1-3 sentence summary in a fan-friendly voice, using only facts given in the article — never invent details or quotes. Empty string if not relevant.'
			}
		},
		required: ['is_gp_relevant', 'headline', 'blurb'],
		additionalProperties: false
	}
}

const SYSTEM_PROMPT = `You are the news editor for a Speedway Grand Prix (FIM Speedway GP) fantasy game. You will be given the title and content of a speedway news article — it may be written in English, Polish, or another language. Determine whether it is specifically relevant to the FIM Speedway Grand Prix — riders competing in GP rounds, GP venues/rounds/schedule, wildcard selections, GP standings/championship, or injuries/call-ups affecting GP participation. General British league (SGB Premiership/Championship), Polish PGE Ekstraliga club racing, other domestic speedway, or unrelated content is not relevant. If relevant, write a short headline and blurb in English (regardless of the source article's language) based only on the facts given — do not invent details or quotes.`

type ClassifyResult = {
	is_gp_relevant: boolean
	headline: string
	blurb: string
}

async function classifyArticle(
	title: string,
	body: string
): Promise<ClassifyResult | null> {
	const response = await anthropic.messages.create({
		model: 'claude-haiku-4-5',
		max_tokens: 512,
		system: SYSTEM_PROMPT,
		tools: [CLASSIFY_TOOL],
		tool_choice: { type: 'tool', name: CLASSIFY_TOOL.name },
		messages: [{ role: 'user', content: `Title: ${title}\n\nContent: ${body}` }]
	})

	const toolUse = response.content.find(
		(block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
	)

	return (toolUse?.input as ClassifyResult | undefined) ?? null
}

export async function refreshNews() {
	const sourceNames = [...FEED_URLS, FIM_SPEEDWAY_NEWS_URL]
	const sourceResults = await Promise.allSettled([
		...FEED_URLS.map((url) => fetchRssFeed(url)),
		fetchFimSpeedwayItems()
	])

	let feedErrors = 0
	const items: FeedItem[] = []

	sourceResults.forEach((result, i) => {
		if (result.status === 'rejected') {
			console.error('Failed to fetch news source', sourceNames[i], result.reason)
			feedErrors++
			return
		}
		items.push(...result.value)
	})

	const guids = items
		.map((item) => item.guid ?? item.link)
		.filter((guid): guid is string => !!guid)

	const existing = guids.length
		? await db
				.selectFrom('news_items')
				.select('source_guid')
				.where('source_guid', 'in', guids)
				.execute()
		: []
	const existingGuids = new Set(existing.map((row) => row.source_guid))

	let inserted = 0
	let skippedExisting = 0
	let skippedNotRelevant = 0
	let errors = 0

	for (const item of items) {
		const guid = item.guid ?? item.link

		if (
			!guid ||
			!item.link ||
			!item.title ||
			(!item.isoDate && !item.pubDate)
		) {
			errors++
			continue
		}

		if (existingGuids.has(guid)) {
			skippedExisting++
			continue
		}

		try {
			const body = item.contentSnippet ?? item['content:encoded'] ?? ''
			const result = await classifyArticle(item.title, body)

			if (!result?.is_gp_relevant) {
				skippedNotRelevant++
				continue
			}

			await db
				.insertInto('news_items')
				.values({
					source_url: item.link,
					source_guid: guid,
					source_title: item.title,
					source_published_at: new Date(item.isoDate ?? item.pubDate!),
					headline: result.headline,
					blurb: result.blurb
				})
				.onConflict((oc) => oc.column('source_guid').doNothing())
				.execute()

			inserted++
		} catch (error) {
			console.error('Failed to process news item', guid, error)
			errors++
		}
	}

	return {
		fetched: items.length,
		inserted,
		skippedExisting,
		skippedNotRelevant,
		errors: errors + feedErrors
	}
}
