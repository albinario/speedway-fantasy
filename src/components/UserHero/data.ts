import { unstable_cache } from 'next/cache'
import { sql } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import { paramValues, type TParamValues } from '@/lib/params'

export const getLeader = unstable_cache(
	(year: number | TParamValues) => _getLeader(year),
	['leader'],
	{ tags: [cacheTags.standings] }
)

async function _getLeader(year: number | TParamValues) {
	return dataFetch(async () => {
		if (year !== paramValues.all) {
			const row = await db
				.selectFrom('users_standings')
				.select(['points', 'user_id'])
				.where('year', '=', year)
				.where('pos', '=', 1)
				.executeTakeFirst()
			return row ? { points: row.points, userId: row.user_id } : null
		}

		const row = await db
			.selectFrom('users_standings')
			.select((eb) => ['user_id', eb.fn.sum<number>('points').as('points')])
			.groupBy('user_id')
			.orderBy('points', 'desc')
			.limit(1)
			.executeTakeFirst()
		return row ? { points: row.points, userId: row.user_id } : null
	}, null)
}

export const getUserStreak = unstable_cache(
	(userId: number) => _getUserStreak(userId),
	['user-streak'],
	{ tags: [cacheTags.picks] }
)

async function _getUserStreak(userId: number): Promise<number> {
	const rows = await dataFetch(
		() =>
			db
				.selectFrom('gps')
				.leftJoin('users_picks', (join) =>
					join
						.onRef('users_picks.gp_id', '=', 'gps.id')
						.on('users_picks.user_id', '=', userId)
				)
				.select(sql<boolean>`users_picks.id IS NOT NULL`.as('has_picks'))
				.where('gps.finished', '=', true)
				.orderBy('gps.start_date', 'desc')
				.execute(),
		[]
	)

	let streak = 0
	for (const row of rows) {
		if (row.has_picks) streak++
		else break
	}
	return streak
}
