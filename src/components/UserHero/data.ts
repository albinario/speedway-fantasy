import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import { paramValues, type TParamValues } from '@/lib/params'

export function getLeaderPoints(year: number | TParamValues) {
	return dataFetch(async () => {
		if (year !== paramValues.all) {
			const row = await db
				.selectFrom('users_standings')
				.select('points')
				.where('year', '=', year)
				.where('pos', '=', 1)
				.executeTakeFirst()
			return row?.points ?? null
		}

		const row = await db
			.selectFrom('users_standings')
			.select((eb) => eb.fn.sum<number>('points').as('points'))
			.groupBy('user_id')
			.orderBy('points', 'desc')
			.limit(1)
			.executeTakeFirst()
		return row?.points ?? null
	}, null)
}


export async function getUserStreak(userId: number): Promise<number> {
	const rows = await dataFetch(
		() =>
			db
				.selectFrom('gps')
				.leftJoin('users_picks', (join) =>
					join
						.onRef('users_picks.gp_id', '=', 'gps.id')
						.on('users_picks.user_id', '=', userId)
				)
				.select(
					sql<boolean>`users_picks.id IS NOT NULL`.as('has_picks')
				)
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
