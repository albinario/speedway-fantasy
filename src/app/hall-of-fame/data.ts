import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getHallOfFame() {
	return dataFetch(
		() =>
			db
				.selectFrom('users_stars')
				.innerJoin('users', 'users.id', 'users_stars.user_id')
				.select([
					'users_stars.id',
					'users_stars.user_id',
					'users_stars.type',
					'users_stars.points',
					'users_stars.year',
					'users.first_name',
					'users.last_name'
				])
				.execute(),
		[]
	)
}
