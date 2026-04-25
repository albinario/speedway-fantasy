import { unstable_cache } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export const getUserGpRow = unstable_cache(
	(gpId: number, viewerId: number) => _getUserGpRow(gpId, viewerId),
	['user-gp-row'],
	{ tags: [cacheTags.gpResults] }
)

/** Returns the viewer's result row for a GP, including picks and position. */
function _getUserGpRow(gpId: number, viewerId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_results')
				.innerJoin(
					'users_with_stars',
					'users_with_stars.id',
					'users_results.user_id'
				)
				.leftJoin('users_picks', (join) =>
					join
						.onRef('users_picks.user_id', '=', 'users_results.user_id')
						.onRef('users_picks.gp_id', '=', 'users_results.gp_id')
				)
				.leftJoin(
					'riders_with_country as r1',
					'r1.id',
					'users_picks.rider_1_id'
				)
				.leftJoin(
					'riders_with_country as r2',
					'r2.id',
					'users_picks.rider_2_id'
				)
				.leftJoin(
					'riders_with_country as r3',
					'r3.id',
					'users_picks.rider_3_id'
				)
				.select([
					'users_results.user_id',
					'users_results.pos',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'users_with_stars.stars',
					'users_results.points',
					'users_results.heats',
					'users_results.medal_1',
					'users_results.medal_2',
					'users_results.medal_3',
					'r1.country_code as pick_1_country',
					'r1.number as pick_1_number',
					'r2.country_code as pick_2_country',
					'r2.number as pick_2_number',
					'r3.country_code as pick_3_country',
					'r3.number as pick_3_number'
				])
				.where('users_results.gp_id', '=', gpId)
				.where('users_results.user_id', '=', viewerId)
				.executeTakeFirst(),
		null
	)
}
