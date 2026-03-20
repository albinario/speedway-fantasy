import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getUsers() {
	return dataFetch(() => db.selectFrom('users').selectAll().execute(), [])
}

export function getViewerDb(auth0Id: string) {
	return db
		.selectFrom('users')
		.select(['first_name', 'last_name'])
		.where('auth0_id', '=', auth0Id)
		.executeTakeFirst()
}

// export type TViewerDb = Awaited<ReturnType<typeof getViewerDb>>
// // export type TViewerDbRow = NonNullable<TViewerDb>
