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
