import { sql } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'
import { paramValues, type TParamValues } from '@/lib/params'

export const getUserStandingRow = cachedQuery(
	(year: number | TParamValues, userId: number) =>
		_getUserStandingRow(year, userId),
	['user-standing-row'],
	{ tags: [cacheTags.standings], fallback: null }
)

async function _getUserStandingRow(
	year: number | TParamValues,
	userId: number
) {
	if (year !== paramValues.all) {
		return (
			db
				.selectFrom('users_standings')
				.innerJoin(
					'users_with_stars',
					'users_with_stars.id',
					'users_standings.user_id'
				)
				.select((eb) => [
					'users_standings.user_id',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'users_standings.points',
					'users_standings.medal_1',
					'users_standings.medal_2',
					'users_standings.medal_3',
					'users_standings.heats',
					'users_standings.pos',
					'users_standings.prev_pos',
					'users_standings.year',
					'users_with_stars.stars',
					eb
						.selectFrom('users_results')
						.innerJoin('gps', 'gps.id', 'users_results.gp_id')
						.select(sql<number>`count(*)`.as('c'))
						.whereRef('users_results.user_id', '=', 'users_standings.user_id')
						.where(sql`EXTRACT(YEAR FROM gps.start_date)`, '=', year)
						.where('users_results.heats', '>', 0)
						.as('gps')
				])
				.where('users_standings.year', '=', year)
				.where('users_standings.user_id', '=', userId)
				.executeTakeFirst() ?? null
		)
	}

	return (
		db
			.selectFrom('users_standings')
			.innerJoin(
				'users_with_stars',
				'users_with_stars.id',
				'users_standings.user_id'
			)
			.select((eb) => [
				'users_standings.user_id',
				'users_with_stars.first_name',
				'users_with_stars.last_name',
				eb.fn.sum('users_standings.points').as('points'),
				eb.fn.sum('users_standings.medal_1').as('medal_1'),
				eb.fn.sum('users_standings.medal_2').as('medal_2'),
				eb.fn.sum('users_standings.medal_3').as('medal_3'),
				eb.fn.sum('users_standings.heats').as('heats'),
				eb
					.selectFrom('users_results')
					.select(sql<number>`count(*)`.as('c'))
					.whereRef('users_results.user_id', '=', 'users_standings.user_id')
					.where('users_results.heats', '>', 0)
					.as('gps'),
				sql<number | null>`null`.as('pos'),
				sql<number | null>`null`.as('prev_pos'),
				sql<number | null>`null`.as('year'),
				'users_with_stars.stars'
			])
			.where('users_standings.user_id', '=', userId)
			.groupBy([
				'users_standings.user_id',
				'users_with_stars.first_name',
				'users_with_stars.last_name',
				'users_with_stars.stars'
			])
			.executeTakeFirst() ?? null
	)
}

export const getUsersFormStandings = cachedQuery(
	(range: 2 | 4, limit?: number) => _getUsersFormStandings(range, limit),
	['users-form-standings'],
	{ tags: [cacheTags.standings], fallback: [] }
)

function _getUsersFormStandings(range: 2 | 4, limit?: number) {
	let query = db
		.selectFrom('users_results')
		.innerJoin(
			'users_with_stars',
			'users_with_stars.id',
			'users_results.user_id'
		)
		.select((eb) => [
			'users_results.user_id',
			'users_with_stars.first_name',
			'users_with_stars.last_name',
			eb.fn.sum('users_results.points').as('points'),
			eb.fn.sum('users_results.medal_1').as('medal_1'),
			eb.fn.sum('users_results.medal_2').as('medal_2'),
			eb.fn.sum('users_results.medal_3').as('medal_3'),
			eb.fn.sum('users_results.heats').as('heats'),
			sql<number>`count(*) filter (where users_results.heats > 0)`.as('gps'),
			sql<number | null>`null`.as('pos'),
			sql<number | null>`null`.as('prev_pos'),
			sql<number | null>`null`.as('year'),
			'users_with_stars.stars'
		])
		.where('users_results.gp_id', 'in', (eb) =>
			eb
				.selectFrom('gps')
				.select('gps.id')
				.where('gps.finished', '=', true)
				.orderBy('gps.start_date', 'desc')
				.limit(range)
		)
		.groupBy([
			'users_results.user_id',
			'users_with_stars.first_name',
			'users_with_stars.last_name',
			'users_with_stars.stars'
		])
		.orderBy('points', 'desc')
		.orderBy('medal_1', 'desc')
		.orderBy('medal_2', 'desc')
		.orderBy('medal_3', 'desc')
		.orderBy('heats', 'desc')

	if (limit !== undefined) {
		query = query.limit(limit)
	}

	return query.execute()
}

export const getUsersStandings = cachedQuery(
	(year: number | TParamValues, limit?: number) =>
		_getUsersStandings(year, limit),
	['users-standings'],
	{ tags: [cacheTags.standings], fallback: [] }
)

function _getUsersStandings(year: number | TParamValues, limit?: number) {
	if (year !== paramValues.all) {
		let query = db
			.selectFrom('users_standings')
			.innerJoin(
				'users_with_stars',
				'users_with_stars.id',
				'users_standings.user_id'
			)
			.select((eb) => [
				'users_standings.user_id',
				'users_with_stars.first_name',
				'users_with_stars.last_name',
				'users_standings.points',
				'users_standings.medal_1',
				'users_standings.medal_2',
				'users_standings.medal_3',
				'users_standings.heats',
				'users_standings.pos',
				'users_standings.prev_pos',
				'users_standings.year',
				'users_with_stars.stars',
				eb
					.selectFrom('users_results')
					.innerJoin('gps', 'gps.id', 'users_results.gp_id')
					.select(sql<number>`count(*)`.as('c'))
					.whereRef('users_results.user_id', '=', 'users_standings.user_id')
					.where(sql`EXTRACT(YEAR FROM gps.start_date)`, '=', year)
					.where('users_results.heats', '>', 0)
					.as('gps')
			])
			.where('users_standings.year', '=', year)
			.orderBy('users_standings.points', 'desc')
			.orderBy('users_standings.medal_1', 'desc')
			.orderBy('users_standings.medal_2', 'desc')
			.orderBy('users_standings.medal_3', 'desc')
			.orderBy('users_standings.heats', 'desc')

		if (limit !== undefined) {
			query = query.limit(limit)
		}

		return query.execute()
	}

	let query = db
		.selectFrom('users_standings')
		.innerJoin(
			'users_with_stars',
			'users_with_stars.id',
			'users_standings.user_id'
		)
		.select((eb) => [
			'users_standings.user_id',
			'users_with_stars.first_name',
			'users_with_stars.last_name',
			eb.fn.sum('users_standings.points').as('points'),
			eb.fn.sum('users_standings.medal_1').as('medal_1'),
			eb.fn.sum('users_standings.medal_2').as('medal_2'),
			eb.fn.sum('users_standings.medal_3').as('medal_3'),
			eb.fn.sum('users_standings.heats').as('heats'),
			eb
				.selectFrom('users_results')
				.select(sql<number>`count(*)`.as('c'))
				.whereRef('users_results.user_id', '=', 'users_standings.user_id')
				.where('users_results.heats', '>', 0)
				.as('gps'),
			sql<number | null>`null`.as('pos'),
			sql<number | null>`null`.as('prev_pos'),
			sql<number | null>`null`.as('year'),
			'users_with_stars.stars'
		])
		.groupBy([
			'users_standings.user_id',
			'users_with_stars.first_name',
			'users_with_stars.last_name',
			'users_with_stars.stars'
		])
		.orderBy('points', 'desc')
		.orderBy('medal_1', 'desc')
		.orderBy('medal_2', 'desc')
		.orderBy('medal_3', 'desc')
		.orderBy('heats', 'desc')

	if (limit !== undefined) {
		query = query.limit(limit)
	}

	return query.execute()
}
