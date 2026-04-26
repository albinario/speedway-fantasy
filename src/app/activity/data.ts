import { unstable_cache } from 'next/cache'

import { sql, type SqlBool } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export const getActivityCount = unstable_cache(
	() =>
		dataFetch(
			() =>
				db
					.selectFrom('activity_log')
					.where(
						sql<SqlBool>`activity_log.id IN (SELECT MAX(id) FROM activity_log GROUP BY user_id, gp_id, action)`
					)
					.select(db.fn.countAll<number>().as('count'))
					.executeTakeFirst(),
			null
		),
	['activity-count'],
	{ tags: [cacheTags.activity] }
)
