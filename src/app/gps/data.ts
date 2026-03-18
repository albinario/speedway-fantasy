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
				.select([
					'gps.id',
					'gps.number as gp_number',
					'cities.id as city_id',
					'cities.name as city_name',
					'countries.code as country_code',
					'gps.start_date',
					'riders.name as wild_card_name',
					'gps.finished',
				])
				.where('gps.id', '=', id)
				.executeTakeFirst(),
		null,
	)
}

export type TGp =
	Awaited<ReturnType<typeof getGp>> extends infer R ? NonNullable<R> : never

export function getGps() {
	return dataFetch(() => db.selectFrom('gps').selectAll().execute(), [])
}
