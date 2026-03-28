import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getCities() {
	return dataFetch(
		() =>
			db
				.selectFrom('cities')
				.select(['id', 'name'])
				.orderBy('name', 'asc')
				.execute(),
		[]
	)
}

export function getCountries() {
	return dataFetch(
		() =>
			db
				.selectFrom('countries')
				.select(['id', 'name', 'code'])
				.orderBy('name', 'asc')
				.execute(),
		[]
	)
}

export function getGPsWildCard() {
	return dataFetch(
		() =>
			db
				.selectFrom('gps')
				.innerJoin('cities', 'cities.id', 'gps.city_id')
				.select(['gps.id', 'gps.round', 'cities.name as city_name'])
				.where('gps.wild_card_id', 'is', null)
				.orderBy('gps.round', 'asc')
				.execute(),
		[]
	)
}

export function getRidersWildCard() {
	return dataFetch(
		() =>
			db
				.selectFrom('riders')
				.select(['id', 'name'])
				.where('active', 'is', null)
				.where('retired', 'is not', true)
				.orderBy('name', 'asc')
				.execute(),
		[]
	)
}
