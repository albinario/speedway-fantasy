import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'

import type { TPositionProgress } from './geometry'

// One row per user and year; `positions` gets the user's standings position
// appended after every reported GP final (see admin/report/actions.ts), which
// also flushes cacheTags.standings.
export const getUsersProgress = cachedQuery(
	(year: number) => _getUsersProgress(year),
	['users-progress'],
	{ tags: [cacheTags.standings], fallback: null }
)

async function _getUsersProgress(year: number): Promise<TPositionProgress> {
	const rows = await db
		.selectFrom('users_progress')
		.select(['user_id', 'positions'])
		.where('year', '=', year)
		.execute()

	const byUser: Record<number, number[]> = {}
	let rounds = 0

	for (const { user_id, positions } of rows) {
		byUser[user_id] = positions
		rounds = Math.max(rounds, positions.length)
	}

	return { byUser, rounds }
}
