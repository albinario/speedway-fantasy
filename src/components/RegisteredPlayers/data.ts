import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'

export const getPicksCount = cachedQuery(
	(gpId: number) => _getPicksCount(gpId),
	['picks-count'],
	{ tags: [cacheTags.picks], fallback: { count: 0 } }
)

function _getPicksCount(gpId: number) {
	return db
		.selectFrom('users_picks')
		.select(db.fn.countAll<number>().as('count'))
		.where('gp_id', '=', gpId)
		.executeTakeFirstOrThrow()
}
