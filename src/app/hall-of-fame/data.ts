import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'

export const getHallOfFame = cachedQuery(
	() => _getHallOfFame(),
	['hall-of-fame'],
	{ tags: [cacheTags.hallOfFame], fallback: [] }
)

function _getHallOfFame() {
	return db
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
		.execute()
}

export const getLatestHallOfFame = cachedQuery(
	() => _getLatestHallOfFame(),
	['hall-of-fame-latest'],
	{ tags: [cacheTags.hallOfFame], fallback: [] }
)

function _getLatestHallOfFame() {
	return db
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
		.execute()
}
