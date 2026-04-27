import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getUser(id: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_with_stars')
				.innerJoin('users', 'users.id', 'users_with_stars.id')
				.select(['users_with_stars.id', 'users_with_stars.first_name', 'users_with_stars.last_name', 'stars', 'users.created_at'])
				.where('users_with_stars.id', '=', id)
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
