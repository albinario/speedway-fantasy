import { unstable_cache } from 'next/cache'
import { sql } from 'kysely'

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
