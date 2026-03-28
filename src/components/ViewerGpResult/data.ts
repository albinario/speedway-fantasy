import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getViewerGpResult(gpId: number, viewerId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_results')
				.select(['users_results.points', 'users_results.pos'])
				.where('users_results.gp_id', '=', gpId)
				.where('users_results.user_id', '=', viewerId)
				.executeTakeFirst(),
		null
	)
}
