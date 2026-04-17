import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getGps(year: number | 'all') {
	return dataFetch(() => {
		let query = db
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
				'gps.start_date',
				'gps.finished',
				'gps.heats_finished',
				'cities.id as city_id',
				'cities.name as city_name',
				'cities.time_zone',
				'countries.code as country_code',
				'gps.wild_card_id',
				'riders.name as wild_card_name',
				'rider_countries.code as wild_card_country_code'
			])
			.orderBy('gps.start_date', 'asc')

		if (year !== 'all') {
			query = query.where(sql`EXTRACT(YEAR FROM gps.start_date)`, '=', year)
		}

		return query.execute()
	}, [])
}

const gpCardSelect = [
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
	'rider_countries.code as wild_card_country_code'
] as const

function gpCardQuery() {
	return db
		.selectFrom('gps')
		.innerJoin('cities', 'gps.city_id', 'cities.id')
		.innerJoin('countries', 'cities.country_id', 'countries.id')
		.leftJoin('riders', 'gps.wild_card_id', 'riders.id')
		.leftJoin(
			'countries as rider_countries',
			'riders.country_id',
			'rider_countries.id'
		)
		.select(gpCardSelect)
}

export function getNextGp() {
	return dataFetch(
		() =>
			gpCardQuery()
				.where('gps.finished', '=', false)
				.orderBy('gps.start_date', 'asc')
				.limit(1)
				.executeTakeFirst(),
		null
	)
}

export function getLatestGp() {
	return dataFetch(
		() =>
			gpCardQuery()
				.where('gps.finished', '=', true)
				.orderBy('gps.start_date', 'desc')
				.limit(1)
				.executeTakeFirst(),
		null
	)
}

export function getGpTopRiders(gpId: number, limit = 3, viewerId?: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('riders_results')
				.innerJoin('riders', 'riders.id', 'riders_results.rider_id')
				.innerJoin('countries', 'countries.id', 'riders.country_id')
				.select((eb) => [
					'riders.id',
					'riders.name',
					'riders.number',
					'countries.code as country_code',
					'riders_results.points',
					'riders_results.medal',
					viewerId != null
						? eb
								.selectFrom('users_picks')
								.select(eb.fn.countAll<number>().as('c'))
								.where('users_picks.gp_id', '=', gpId)
								.where('users_picks.user_id', '=', viewerId)
								.where((eb) =>
									eb.or([
										eb('users_picks.rider_1_id', '=', eb.ref('riders.id')),
										eb('users_picks.rider_2_id', '=', eb.ref('riders.id')),
										eb('users_picks.rider_3_id', '=', eb.ref('riders.id'))
									])
								)
								.as('viewer_picked')
						: eb.lit<number>(0).as('viewer_picked')
				])
				.where('riders_results.gp_id', '=', gpId)
				.orderBy('riders_results.points', 'desc')
				.limit(limit)
				.execute(),
		[]
	)
}

export function getGpUserResult(gpId: number, userId: number) {
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
				.select([
					'users_with_stars.id',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'users_with_stars.stars',
					'users_results.points',
					'users_results.pos',
					'users_results.medal_1',
					'users_results.medal_2',
					'users_results.medal_3'
				])
				.where('users_results.gp_id', '=', gpId)
				.where('users_results.user_id', '=', userId)
				.executeTakeFirst(),
		undefined
	)
}

export function getGpTopUsers(gpId: number, limit = 3) {
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
				.select([
					'users_with_stars.id',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'users_with_stars.stars',
					'users_results.points',
					'users_results.pos',
					'users_results.medal_1',
					'users_results.medal_2',
					'users_results.medal_3'
				])
				.where('users_results.gp_id', '=', gpId)
				.orderBy(sql`users_results.pos asc nulls last`)
				.limit(limit)
				.execute(),
		[]
	)
}
