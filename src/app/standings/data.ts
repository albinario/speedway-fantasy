import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getStandings(year: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_standings')
				.innerJoin('users', 'users_standings.user_id', 'users.id')
				.select((eb) => [
					'users_standings.user_id',
					'users.first_name',
					'users.last_name',
					'users_standings.points',
					'users_standings.medal_1',
					'users_standings.medal_2',
					'users_standings.medal_3',
					'users_standings.heats',
					'users_standings.pos',
					'users_standings.prev_pos',
					'users_standings.year'
				])
				.where('users_standings.year', '=', year)
				.limit(10)
				.orderBy('users_standings.points', 'desc')
				.execute(),
		[]
	)
}
