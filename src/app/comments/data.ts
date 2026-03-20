import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getComments() {
	return dataFetch(() => db.selectFrom('comments').selectAll().execute(), [])
}
