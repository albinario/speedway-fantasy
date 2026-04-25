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
					.leftJoin('users', 'comments.user_id', 'users.id')
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
						'users.first_name',
						'users.last_name',
						'gps.round as gp_round',
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
