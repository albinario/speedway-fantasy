import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getUser(id: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_with_stars')
				.select(['id', 'first_name', 'last_name', 'stars'])
				.where('id', '=', id)
				.executeTakeFirst(),
		null
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
