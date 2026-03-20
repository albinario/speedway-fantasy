import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getRiders() {
	return dataFetch(() => db.selectFrom('riders').selectAll().execute(), [])
}
