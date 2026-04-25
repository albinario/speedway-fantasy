import { unstable_cache } from 'next/cache'
import { sql } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export const getGps = unstable_cache(
	(year: number | 'all') =>
		dataFetch(() => {
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
		}, []),
	['gps'],
	{ tags: [cacheTags.gps] }
)

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

export const getNextGp = unstable_cache(
	() =>
		dataFetch(
			() =>
				gpCardQuery()
					.where('gps.start_date', '>', new Date())
					.orderBy('gps.start_date', 'asc')
					.limit(1)
					.executeTakeFirst(),
			null
		),
	['next-gp'],
	{ tags: [cacheTags.gps], revalidate: 300 }
)

export const getLatestGp = unstable_cache(
	() =>
		dataFetch(
			() =>
				gpCardQuery()
					.where('gps.start_date', '<=', new Date())
					.orderBy('gps.start_date', 'desc')
					.limit(1)
					.executeTakeFirst(),
			null
		),
	['latest-gp'],
	{ tags: [cacheTags.gps], revalidate: 300 }
)

export const getActiveGp = unstable_cache(
	() =>
		dataFetch(
			() =>
				gpCardQuery()
					.where('gps.finished', '=', false)
					.orderBy('gps.start_date', 'asc')
					.limit(1)
					.executeTakeFirst(),
			null
		),
	['active-gp'],
	{ tags: [cacheTags.gps], revalidate: 300 }
)
