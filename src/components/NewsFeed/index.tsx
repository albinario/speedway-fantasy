import { ExternalLink } from 'lucide-react'

import { getPublishedNews } from '@/app/news/data'

type TNewsFeed = {
	limit?: number
	offset?: number
}

// Some sources (e.g. fimspeedway.com) publish titles in all caps. Convert
// those to title case for display, leaving already-mixed-case titles as-is.
// Short/numeric tokens (acronyms like "GP", "FIM") are left uppercase.
function displayTitle(title: string) {
	const isShouting = title === title.toUpperCase() && title !== title.toLowerCase()
	if (!isShouting) return title

	return title
		.toLowerCase()
		.replace(/[a-z0-9]+(?:'[a-z0-9]+)?/g, (word) =>
			word.length <= 3 ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)
		)
}

export async function NewsFeed({ limit = 20, offset = 0 }: TNewsFeed) {
	const items = await getPublishedNews(limit, offset)

	if (!items.length) return null

	return (
		<div className="flex flex-col gap-3">
			{items.map((item) => (
				<div
					key={item.id}
					className="flex flex-col gap-1.5 rounded-lg border p-4"
				>
					<div className="flex items-start justify-between gap-3">
						<h3 className="font-bold">{item.headline}</h3>

						<time className="text-muted-foreground shrink-0 text-xs tabular-nums">
							{new Date(item.source_published_at).toLocaleString('sv-SE', {
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								timeZone: 'Europe/Stockholm'
							})}
						</time>
					</div>

					<p className="text-sm">{item.blurb}</p>

					<a
						className="text-muted-foreground mt-1 flex items-center gap-1 text-xs hover:underline"
						href={item.source_url}
						rel="noopener noreferrer"
						target="_blank"
					>
						{displayTitle(item.source_title)}
						<ExternalLink className="size-3" />
					</a>
				</div>
			))}
		</div>
	)
}
