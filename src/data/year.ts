import { unstable_cache } from 'next/cache'
import { sql } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export const getYears = unstable_cache(
	() =>
		dataFetch(
			() =>
				db
					.selectFrom('gps')
					.select(sql<number>`EXTRACT(YEAR FROM start_date)::int`.as('value'))
					.distinct()
					.orderBy('value', 'desc')
					.execute(),
			[]
		),
	['years'],
	{ revalidate: false }
)
export type TYears =
	Awaited<ReturnType<typeof getYears>> extends infer R ? NonNullable<R> : never

export const getLatestStandingsYear = unstable_cache(
	async () => {
		const row = await dataFetch(
			() =>
				db
					.selectFrom('users_standings')
					.select((eb) => eb.fn.max('year').as('year'))
					.executeTakeFirst(),
			undefined
		)
		return row?.year ?? null
	},
	['latest-standings-year'],
	{ tags: [cacheTags.standings] }
)
