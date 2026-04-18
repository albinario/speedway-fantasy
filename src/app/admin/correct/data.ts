import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getThisYearRiders() {
	const year = new Date().getFullYear()
	return dataFetch(
		() =>
			db
				.selectFrom('riders_results')
				.innerJoin('gps', 'gps.id', 'riders_results.gp_id')
				.innerJoin(
					'riders_with_country',
					'riders_with_country.id',
					'riders_results.rider_id'
				)
				.select(['riders_with_country.id', 'riders_with_country.name'])
				.where(sql`EXTRACT(YEAR FROM gps.start_date)`, '=', year)
				.distinct()
				.orderBy('riders_with_country.name', 'asc')
				.execute(),
		[]
	)
}

export function getThisYearGps() {
	const year = new Date().getFullYear()
	return dataFetch(
		() =>
			db
				.selectFrom('gps')
				.innerJoin('cities', 'cities.id', 'gps.city_id')
				.select([
					'gps.id',
					'gps.round',
					'cities.name as city_name',
					'gps.start_date'
				])
				.where(sql`EXTRACT(YEAR FROM gps.start_date)`, '=', year)
				.orderBy('gps.start_date', 'asc')
				.execute(),
		[]
	)
}
