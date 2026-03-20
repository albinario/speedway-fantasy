import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function __DATA_FUNCTION__() {
	return dataFetch(
		() => db.selectFrom('__TABLE_NAME__').selectAll().execute(),
		[],
	)
}
