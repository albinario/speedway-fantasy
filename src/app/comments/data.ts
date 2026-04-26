import { unstable_cache } from 'next/cache'
import { sql } from 'kysely'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import type { Reaction } from './constants'

export type { Reaction }

export const getComments = unstable_cache(
	() =>
		dataFetch(
			() =>
				db
					.selectFrom('comments')
					.leftJoin('users_with_stars', 'comments.user_id', 'users_with_stars.id')
					.leftJoin('gps', 'comments.gp_id', 'gps.id')
					.leftJoin('cities', 'gps.city_id', 'cities.id')
					.leftJoin('countries', 'cities.country_id', 'countries.id')
					.select([
						'comments.id',
						'comments.comment',
						'comments.created_at',
						'comments.reply_to_id',
						'comments.user_id',
						'comments.gp_id',
						'users_with_stars.first_name',
						'users_with_stars.last_name',
						'users_with_stars.stars',
						'gps.start_date as gp_start_date',
						'cities.name as city_name',
						'countries.code as country_code',
						sql<Reaction[]>`
							COALESCE(
								(
									SELECT json_agg(r ORDER BY r.count DESC)
									FROM (
										SELECT
											emoji,
											COUNT(*)::int AS count,
											array_agg(user_id) AS user_ids
										FROM comment_reactions
										WHERE comment_id = comments.id
										GROUP BY emoji
									) r
								),
								'[]'::json
							)
						`.as('reactions'),
					])
					.orderBy('comments.created_at', 'asc')
					.execute(),
			[]
		),
	['comments'],
	{ tags: [cacheTags.comments, cacheTags.reactions] }
)
