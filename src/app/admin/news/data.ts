import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'
import { NewsStatus } from '@/lib/news-status'

export async function getPendingNewsItems() {
	return dataFetch(
		() =>
			db
				.selectFrom('news_items')
				.selectAll()
				.where('status', '=', NewsStatus.Pending)
				.orderBy('created_at', 'desc')
				.execute(),
		[]
	)
}
