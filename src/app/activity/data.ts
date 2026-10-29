import { sql, type SqlBool } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'

export const getActivityCount = cachedQuery(
	() =>
		db
			.selectFrom('activity_log')
			.where(
				sql<SqlBool>`activity_log.id IN (SELECT MAX(id) FROM activity_log GROUP BY user_id, gp_id, action)`
			)
			.select(db.fn.countAll<number>().as('count'))
			.executeTakeFirst(),
	['activity-count'],
	{ tags: [cacheTags.activity], fallback: null }
)
