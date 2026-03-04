import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getUsers() {
	return dataFetch(() => db.selectFrom('users').selectAll().execute())
}

export function getUserByAuth0Id(auth0Id: string) {
	return db
		.selectFrom('users')
		.select(['first_name'])
		.where('auth0_id', '=', auth0Id)
		.executeTakeFirst()
}
