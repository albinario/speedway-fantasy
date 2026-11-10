import { cache } from 'react'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

// cache(): shared by generateMetadata and the page within one request
export const getUser = cache((id: number) =>
	dataFetch(
		() =>
			db
				.selectFrom('users_with_stars')
				.innerJoin('users', 'users.id', 'users_with_stars.id')
				.select([
					'users_with_stars.id',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'stars',
					'users.created_at'
				])
				.where('users_with_stars.id', '=', id)
				.executeTakeFirst(),
		null
	)
)

export function getUserResultGpIds(userId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_results')
				.select('gp_id')
				.where('user_id', '=', userId)
				.execute(),
		[]
	)
}

export function getUserStars(userId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_stars')
				.select(['type', 'year'])
				.where('user_id', '=', userId)
				.orderBy('year', 'asc')
				.execute(),
		[]
	)
}
