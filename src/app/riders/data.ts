import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import { paramValues, type TParamValues } from '@/lib/params'

export function getRidersActive() {
	return dataFetch(
		() =>
			db
				.selectFrom('riders_with_country')
				.innerJoin('riders', 'riders.id', 'riders_with_country.id')
				.select([
					'riders_with_country.id',
					'riders_with_country.name',
					'riders_with_country.country_code',
					'riders_with_country.number'
				])
				.where('riders.active', 'is not', null)
				.orderBy('active')
				.execute(),
		[]
	)
}

export function getRidersStandings(
	year: number | TParamValues,
	limit?: number
) {
	return dataFetch(() => {
		if (year !== paramValues.all) {
			const timesPickedYearScoped = sql<number>`(
				SELECT COUNT(*)
				FROM users_picks up
				INNER JOIN gps pick_gps ON pick_gps.id = up.gp_id
				WHERE EXTRACT(YEAR FROM pick_gps.start_date) = ${year}
				  AND (
				    up.rider_1_id = riders_results.rider_id
				    OR up.rider_2_id = riders_results.rider_id
				    OR up.rider_3_id = riders_results.rider_id
				  )
			)`

			let query = db
				.selectFrom('riders_results')
				.innerJoin(
					'riders_with_country',
					'riders_results.rider_id',
					'riders_with_country.id'
				)
				.innerJoin('gps', 'riders_results.gp_id', 'gps.id')
				.select((eb) => [
					'riders_results.rider_id',
					'riders_with_country.name',
					'riders_with_country.number',
					'riders_with_country.country_code',
					eb.fn.sum<number>('riders_results.points').as('total_points'),
					eb.fn.count<number>('riders_results.gp_id').as('gps'),
					eb.fn.sum<number>('riders_results.heats').as('heats'),
					sql<
						number[]
					>`ARRAY_AGG(riders_results.medal ORDER BY riders_results.medal) FILTER (WHERE riders_results.medal IS NOT NULL)`.as(
						'medals'
					),
					timesPickedYearScoped.as('times_picked')
				])
				.where(sql<number>`EXTRACT(YEAR FROM gps.start_date)`, '=', year)
				.groupBy([
					'riders_results.rider_id',
					'riders_with_country.name',
					'riders_with_country.number',
					'riders_with_country.country_code'
				])
				.orderBy('total_points', 'desc')

			if (limit !== undefined) {
				query = query.limit(limit)
			}

			return query.execute()
		}

		const timesPickedAllYears = sql<number>`(
			SELECT COUNT(*)
			FROM users_picks up
			WHERE up.rider_1_id = riders_results.rider_id
			   OR up.rider_2_id = riders_results.rider_id
			   OR up.rider_3_id = riders_results.rider_id
		)`

		let query = db
			.selectFrom('riders_results')
			.innerJoin(
				'riders_with_country',
				'riders_results.rider_id',
				'riders_with_country.id'
			)
			.select((eb) => [
				'riders_results.rider_id',
				'riders_with_country.name',
				'riders_with_country.number',
				'riders_with_country.country_code',
				eb.fn.sum<number>('riders_results.points').as('total_points'),
				eb.fn.count<number>('riders_results.gp_id').as('gps'),
				eb.fn.sum<number>('riders_results.heats').as('heats'),
				sql<
					number[]
				>`ARRAY_AGG(riders_results.medal ORDER BY riders_results.medal) FILTER (WHERE riders_results.medal IS NOT NULL)`.as(
					'medals'
				),
				timesPickedAllYears.as('times_picked')
			])
			.groupBy([
				'riders_results.rider_id',
				'riders_with_country.name',
				'riders_with_country.number',
				'riders_with_country.country_code'
			])
			.orderBy('total_points', 'desc')

		if (limit !== undefined) {
			query = query.limit(limit)
		}

		return query.execute()
	}, [])
}
