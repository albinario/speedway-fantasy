import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getGp(id: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('gps')
				.innerJoin('cities', 'gps.city_id', 'cities.id')
				.innerJoin('countries', 'cities.country_id', 'countries.id')
				.leftJoin('riders', 'gps.wild_card_id', 'riders.id')
				.leftJoin(
					'countries as rider_countries',
					'riders.country_id',
					'rider_countries.id'
				)
				.select([
					'gps.id',
					'gps.round',
					'cities.id as city_id',
					'cities.name as city_name',
					'cities.time_zone',
					'countries.code as country_code',
					'gps.start_date',
					'gps.heats_finished',
					'gps.wild_card_id',
					'riders.name as wild_card_name',
					'riders.country_id as wild_card_country_id',
					'rider_countries.code as wild_card_country_code',
					'gps.finished'
				])
				.where('gps.id', '=', id)
				.executeTakeFirst(),
		null
	)
}

export function getGpRidersResults(gpId: number, viewerId?: number) {
	return dataFetch(
		() =>
			db
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
					'riders_results.points',
					'riders_results.heats',
					'riders_results.medal',
					eb
						.selectFrom('users_picks')
						.select(eb.fn.countAll<number>().as('c'))
						.where('users_picks.gp_id', '=', gpId)
						.where((eb) =>
							eb.or([
								eb(
									'users_picks.rider_1_id',
									'=',
									eb.ref('riders_results.rider_id')
								),
								eb(
									'users_picks.rider_2_id',
									'=',
									eb.ref('riders_results.rider_id')
								),
								eb(
									'users_picks.rider_3_id',
									'=',
									eb.ref('riders_results.rider_id')
								)
							])
						)
						.as('times_picked'),
					viewerId != null
						? eb
								.selectFrom('users_picks')
								.select(eb.fn.countAll<number>().as('c'))
								.where('users_picks.gp_id', '=', gpId)
								.where('users_picks.user_id', '=', viewerId)
								.where((eb) =>
									eb.or([
										eb(
											'users_picks.rider_1_id',
											'=',
											eb.ref('riders_results.rider_id')
										),
										eb(
											'users_picks.rider_2_id',
											'=',
											eb.ref('riders_results.rider_id')
										),
										eb(
											'users_picks.rider_3_id',
											'=',
											eb.ref('riders_results.rider_id')
										)
									])
								)
								.as('viewer_picked')
						: eb.lit<number>(0).as('viewer_picked')
				])
				.where('riders_results.gp_id', '=', gpId)
				.orderBy('riders_results.points', 'desc')
				.execute(),
		[]
	)
}

export function getGpUsersResults(gpId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_results')
				.innerJoin(
					'users_with_stars',
					'users_with_stars.id',
					'users_results.user_id'
				)
				.innerJoin('gps', 'gps.id', 'users_results.gp_id')
				.leftJoin('users_standings', (join) =>
					join
						.onRef('users_standings.user_id', '=', 'users_results.user_id')
						.on(sql`users_standings.year = EXTRACT(YEAR FROM gps.start_date)`)
				)
				.leftJoin('users_picks', (join) =>
					join
						.onRef('users_picks.user_id', '=', 'users_results.user_id')
						.onRef('users_picks.gp_id', '=', 'users_results.gp_id')
				)
				.leftJoin(
					'riders_with_country as r1',
					'r1.id',
					'users_picks.rider_1_id'
				)
				.leftJoin(
					'riders_with_country as r2',
					'r2.id',
					'users_picks.rider_2_id'
				)
				.leftJoin(
					'riders_with_country as r3',
					'r3.id',
					'users_picks.rider_3_id'
				)
				.select([
					'users_results.user_id',
					'users_results.pos',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'users_with_stars.stars',
					'users_results.points',
					'users_results.heats',
					'users_results.medal_1',
					'users_results.medal_2',
					'users_results.medal_3',
					'r1.country_code as pick_1_country',
					'r1.number as pick_1_number',
					'r2.country_code as pick_2_country',
					'r2.number as pick_2_number',
					'r3.country_code as pick_3_country',
					'r3.number as pick_3_number',
					'users_standings.points as season_points'
				])
				.where('users_results.gp_id', '=', gpId)
				.orderBy('users_results.pos', 'asc')
				.orderBy(sql`users_standings.pos asc nulls last`)
				.execute(),
		[]
	)
}
