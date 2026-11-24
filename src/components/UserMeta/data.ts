import { sql } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'

export const getUserStreak = cachedQuery(
	(userId: number) => _getUserStreak(userId),
	['user-streak'],
	{ tags: [cacheTags.picks], fallback: { streak: 0, total: 0 } }
)

// total = finished GPs overall, so streak === total means the user never missed one
async function _getUserStreak(
	userId: number
): Promise<{ streak: number; total: number }> {
	const rows = await db
		.selectFrom('gps')
		.leftJoin('users_picks', (join) =>
			join
				.onRef('users_picks.gp_id', '=', 'gps.id')
				.on('users_picks.user_id', '=', userId)
		)
		.select(sql<boolean>`users_picks.id IS NOT NULL`.as('has_picks'))
		.where('gps.finished', '=', true)
		.orderBy('gps.start_date', 'desc')
		.execute()

	let streak = 0
	for (const row of rows) {
		if (row.has_picks) streak++
		else break
	}
	return { streak, total: rows.length }
}
