import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getUser(id: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_with_stars')
				.select(['id', 'first_name', 'last_name'])
				.where('id', '=', id)
				.executeTakeFirst(),
		null
	)
}
