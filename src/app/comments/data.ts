import { unstable_cache } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

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
					])
					.orderBy('comments.created_at', 'asc')
					.execute(),
			[]
		),
	['comments'],
	{ tags: [cacheTags.comments] }
)
