import { unstable_cache } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export const getPicksCount = unstable_cache(
	(gpId: number) => _getPicksCount(gpId),
	['picks-count'],
	{ tags: [cacheTags.picks] }
)

function _getPicksCount(gpId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_picks')
				.select(db.fn.countAll<number>().as('count'))
				.where('gp_id', '=', gpId)
				.executeTakeFirstOrThrow(),
		{ count: 0 }
	)
}
