import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getEmailList() {
	return dataFetch(
		() =>
			db
				.selectFrom('users')
				.select('email')
				.where('reminder', '=', true)
				.orderBy('email', 'asc')
				.execute(),
		[]
	)
}
