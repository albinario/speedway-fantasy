import { unstable_cache } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import { NewsStatus } from '@/lib/news-status'

export const getPublishedNews = unstable_cache(
	(limit: number, offset: number) =>
		dataFetch(
			() =>
				db
					.selectFrom('news_items')
					.select([
						'id',
						'headline',
						'blurb',
						'source_url',
						'source_title',
						'source_published_at'
					])
					.where('status', '=', NewsStatus.Published)
					.orderBy('source_published_at', 'desc')
					.limit(limit)
					.offset(offset)
					.execute(),
			[]
		),
	['news'],
	{ tags: [cacheTags.news] }
)

export const getPublishedNewsCount = unstable_cache(
	() =>
		dataFetch(
			() =>
				db
					.selectFrom('news_items')
					.where('status', '=', NewsStatus.Published)
					.select(db.fn.countAll<number>().as('count'))
					.executeTakeFirst(),
			null
		),
	['news-count'],
	{ tags: [cacheTags.news] }
)
