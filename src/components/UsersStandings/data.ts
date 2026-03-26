import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import { paramValues, type TParamValues } from '@/lib/params'

export function getUsersStandings(year: number | TParamValues, limit?: number) {
	return dataFetch(() => {
		if (year !== paramValues.all) {
			let query = db
				.selectFrom('users_standings')
				.innerJoin(
					'users_with_stars',
					'users_with_stars.id',
					'users_standings.user_id'
				)
				.select([
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
					'users_with_stars.stars'
				])
				.where('users_standings.year', '=', year)
				.orderBy('users_standings.points', 'desc')

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

		if (limit !== undefined) {
			query = query.limit(limit)
		}

		return query.execute()
	}, [])
}
