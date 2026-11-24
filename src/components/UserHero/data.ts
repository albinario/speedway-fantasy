import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'
import { paramValues, type TParamValues } from '@/lib/params'

export const getLeader = cachedQuery(
	(year: number | TParamValues) => _getLeader(year),
	['leader'],
	{ tags: [cacheTags.standings], fallback: null }
)

async function _getLeader(year: number | TParamValues) {
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
}
