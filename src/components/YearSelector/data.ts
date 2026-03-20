import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getYears() {
	return dataFetch(
		() =>
			db
				.selectFrom('gps')
				.select(sql<number>`EXTRACT(YEAR FROM start_date)::int`.as('value'))
				.distinct()
				.orderBy('value', 'desc')
				.execute(),
		[]
	)
}
export type TYears =
	Awaited<ReturnType<typeof getYears>> extends infer R ? NonNullable<R> : never
