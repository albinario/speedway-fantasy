import { unstable_cache } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export const getHallOfFame = unstable_cache(
	() => _getHallOfFame(),
	['hall-of-fame'],
	{ tags: [cacheTags.hallOfFame] }
)

function _getHallOfFame() {
	return dataFetch(
		() =>
			db
				.selectFrom('users_stars')
				.innerJoin('users', 'users.id', 'users_stars.user_id')
				.select([
					'users_stars.id',
					'users_stars.user_id',
					'users_stars.type',
					'users_stars.points',
					'users_stars.year',
					'users.first_name',
					'users.last_name'
				])
				.execute(),
		[]
	)
}

export const getLatestHallOfFame = unstable_cache(
	() => _getLatestHallOfFame(),
	['hall-of-fame-latest'],
	{ tags: [cacheTags.hallOfFame] }
)

function _getLatestHallOfFame() {
	return dataFetch(
		() =>
			db
				.selectFrom('users_stars')
				.innerJoin('users', 'users.id', 'users_stars.user_id')
				.select([
					'users_stars.id',
					'users_stars.user_id',
					'users_stars.type',
					'users_stars.points',
					'users_stars.year',
					'users.first_name',
					'users.last_name'
				])
				.where('users_stars.year', '=', (eb) =>
					eb.selectFrom('users_stars').select(eb.fn.max('year').as('year'))
				)
				.orderBy('users_stars.type')
				.execute(),
		[]
	)
}
