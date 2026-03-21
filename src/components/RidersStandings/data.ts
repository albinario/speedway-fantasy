import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import { paramValues, type TParamValues } from '@/lib/params'

export function getRidersStandings(
	year: number | TParamValues,
	limit?: number
) {
	return dataFetch(() => {
		if (year !== paramValues.all) {
			let query = db
				.selectFrom('riders_results')
				.innerJoin('riders', 'riders_results.rider_id', 'riders.id')
				.select((eb) => [
					'riders_results.rider_id',
					'riders.name',
					eb.fn.sum<number>('riders_results.points').as('total_points')
				])
				.orderBy('riders_results.points', 'desc')
				.groupBy([
					'riders_results.rider_id',
					'riders.name',
					'riders_results.points'
				])

			if (limit !== undefined) {
				query = query.limit(limit)
			}
			console.log(query.compile())

			return query.execute()
		}

		let query = db
			.selectFrom('riders_results')
			.innerJoin('riders', 'riders_results.rider_id', 'riders.id')
			.select((eb) => [
				'riders_results.rider_id',
				'riders.name',
				eb.fn.sum('riders_results.points').as('total_points')
			])
			.groupBy(['riders_results.rider_id', 'riders.name'])
			.orderBy('total_points', 'desc')

		if (limit !== undefined) {
			query = query.limit(limit)
		}

		return query.execute()
	}, [])
}
