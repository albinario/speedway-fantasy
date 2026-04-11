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


export function getGpTopRider(gpId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('riders_results')
				.innerJoin('riders', 'riders.id', 'riders_results.rider_id')
				.innerJoin('countries', 'countries.id', 'riders.country_id')
				.select(['riders.id', 'riders.name', 'riders.number', 'countries.code as country_code'])
				.where('riders_results.gp_id', '=', gpId)
				.orderBy('riders_results.points', 'desc')
				.limit(1)
				.executeTakeFirst(),
		null
	)
}

export function getGpTopUser(gpId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_results')
				.innerJoin('users_with_stars', 'users_with_stars.id', 'users_results.user_id')
				.innerJoin('gps', 'gps.id', 'users_results.gp_id')
				.leftJoin('users_standings', (join) =>
					join
						.onRef('users_standings.user_id', '=', 'users_results.user_id')
						.on(sql`users_standings.year = EXTRACT(YEAR FROM gps.start_date)`)
				)
				.select(['users_with_stars.id', 'users_with_stars.first_name', 'users_with_stars.last_name', 'users_with_stars.stars', 'users_results.points'])
				.where('users_results.gp_id', '=', gpId)
				.orderBy('users_results.points', 'desc')
				.orderBy(sql`users_standings.pos asc nulls last`)
				.limit(1)
				.executeTakeFirst(),
		null
	)
}


