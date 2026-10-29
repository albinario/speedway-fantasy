import { sql } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'

export const getYears = cachedQuery(
	() =>
		db
			.selectFrom('gps')
			.select(sql<number>`EXTRACT(YEAR FROM start_date)::int`.as('value'))
			.distinct()
			.orderBy('value', 'desc')
			.execute(),
	['years'],
	{ revalidate: false, fallback: [] }
)
export type TYears =
	Awaited<ReturnType<typeof getYears>> extends infer R ? NonNullable<R> : never

export const getLatestStandingsYear = cachedQuery(
	async () => {
		const row = await db
			.selectFrom('users_standings')
			.select((eb) => eb.fn.max('year').as('year'))
			.executeTakeFirst()
		return row?.year ?? null
	},
	['latest-standings-year'],
	{ tags: [cacheTags.standings], fallback: null }
)
