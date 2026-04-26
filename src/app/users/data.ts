import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getUsers() {
	return dataFetch(
		() =>
			db
				.selectFrom('users_with_stars')
				.leftJoin(
					'users_results',
					'users_results.user_id',
					'users_with_stars.id'
				)
				.leftJoin('gps', 'gps.id', 'users_results.gp_id')
				.select((eb) => [
					'users_with_stars.id',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'users_with_stars.stars',
					eb.fn
						.count<number>('users_results.id')
						.filterWhere('gps.heats_finished', '>', 0)
						.as('gps')
				])
				.groupBy([
					'users_with_stars.id',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'users_with_stars.stars'
				])
				.orderBy('gps', 'desc')
				.orderBy('users_with_stars.id', 'asc')
				.execute(),
		[]
	)
}

export function getViewerDb(auth0Id: string) {
	return db
		.selectFrom('users')
		.select(['id', 'first_name', 'last_name', 'reminder', 'comments_last_read_at'])
		.where('auth0_id', '=', auth0Id)
		.executeTakeFirst()
}
