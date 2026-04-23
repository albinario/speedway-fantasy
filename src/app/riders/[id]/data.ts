import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import { paramValues, type TParamValues } from '@/lib/params'

export function getRider(id: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('riders_with_country')
				.select(['id', 'name', 'number', 'country_code'])
				.where('id', '=', id)
				.executeTakeFirst(),
		null
	)
}

export function getRiderStats(riderId: number, year: number | TParamValues) {
	return dataFetch(async () => {
		let query = db
			.selectFrom('riders_results')
			.innerJoin('gps', 'gps.id', 'riders_results.gp_id')
			.select((eb) => [
				eb.fn.sum<number>('riders_results.points').as('points'),
				eb.fn.count<number>('riders_results.gp_id').as('gps'),
				eb.fn.sum<number>('riders_results.heats').as('heats'),
				eb.fn
					.count<number>('riders_results.id')
					.filterWhere('riders_results.medal', '=', 1)
					.as('gold'),
				eb.fn
					.count<number>('riders_results.id')
					.filterWhere('riders_results.medal', '=', 2)
					.as('silver'),
				eb.fn
					.count<number>('riders_results.id')
					.filterWhere('riders_results.medal', '=', 3)
					.as('bronze'),
				sql<number>`(
					SELECT COUNT(*) FROM users_picks up
					INNER JOIN gps pick_gps ON pick_gps.id = up.gp_id
					WHERE ${year !== paramValues.all ? sql`EXTRACT(YEAR FROM pick_gps.start_date) = ${year} AND` : sql``}
					(up.rider_1_id = ${riderId} OR up.rider_2_id = ${riderId} OR up.rider_3_id = ${riderId})
				)`.as('times_picked')
			])
			.where('riders_results.rider_id', '=', riderId)

		if (year !== paramValues.all) {
			query = query.where(sql`EXTRACT(YEAR FROM gps.start_date)`, '=', year)
		}

		return query.executeTakeFirst() ?? null
	}, null)
}

export function getRiderGps(riderId: number, year: number | TParamValues) {
	return dataFetch(() => {
		let query = db
			.selectFrom('riders_results')
			.innerJoin('gps', 'gps.id', 'riders_results.gp_id')
			.innerJoin('cities', 'cities.id', 'gps.city_id')
			.innerJoin('countries', 'countries.id', 'cities.country_id')
			.leftJoin('riders', 'riders.id', 'gps.wild_card_id')
			.leftJoin(
				'countries as rider_countries',
				'rider_countries.id',
				'riders.country_id'
			)
			.select((eb) => [
				'gps.id',
				'gps.round',
				'gps.start_date',
				'gps.finished',
				'gps.heats_finished',
				'cities.id as city_id',
				'cities.name as city_name',
				'cities.time_zone',
				'countries.code as country_code',
				'gps.wild_card_id',
				'riders.name as wild_card_name',
				'rider_countries.code as wild_card_country_code',
				'riders_results.points',
				'riders_results.heats',
				'riders_results.medal',
				eb
					.selectFrom('users_picks')
					.select(eb.fn.countAll<number>().as('c'))
					.where('users_picks.gp_id', '=', eb.ref('gps.id'))
					.where((eb) =>
						eb.or([
							eb('users_picks.rider_1_id', '=', riderId),
							eb('users_picks.rider_2_id', '=', riderId),
							eb('users_picks.rider_3_id', '=', riderId)
						])
					)
					.as('times_picked'),
				eb
					.selectFrom('users_picks')
					.select(eb.fn.countAll<number>().as('c'))
					.where('users_picks.gp_id', '=', eb.ref('gps.id'))
					.as('total_pickers')
			])
			.where('riders_results.rider_id', '=', riderId)
			.orderBy('gps.start_date', 'asc')

		if (year !== paramValues.all) {
			query = query.where(sql`EXTRACT(YEAR FROM gps.start_date)`, '=', year)
		}

		return query.execute()
	}, [])
}
