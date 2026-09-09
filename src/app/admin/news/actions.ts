'use server'

import { updateTag } from 'next/cache'

import { getViewer } from '@/lib/auth/get-viewer'
import { cacheTags } from '@/lib/cache-tags'
import { db } from '@/lib/db'
import { refreshNews } from '@/lib/news'
import { NewsStatus } from '@/lib/news-status'

export async function approveNewsItemAction(
	id: number,
	headline: string,
	blurb: string
): Promise<{ error?: string }> {
	const viewer = await getViewer()
	if (!viewer.isAdmin) return { error: 'Forbidden' }

	await db
		.updateTable('news_items')
		.set({
			headline,
			blurb,
			status: NewsStatus.Published,
			reviewed_by_user_id: viewer.db?.id,
			reviewed_at: new Date(),
			updated_at: new Date()
		})
		.where('id', '=', id)
		.execute()

	updateTag(cacheTags.news)

	return {}
}

export async function rejectNewsItemAction(
	id: number,
	reason?: string
): Promise<{ error?: string }> {
	const viewer = await getViewer()
	if (!viewer.isAdmin) return { error: 'Forbidden' }

	await db
		.updateTable('news_items')
		.set({
			status: NewsStatus.Rejected,
			rejected_reason: reason ?? null,
			reviewed_by_user_id: viewer.db?.id,
			reviewed_at: new Date(),
			updated_at: new Date()
		})
		.where('id', '=', id)
		.execute()

	updateTag(cacheTags.news)

	return {}
}

export async function refreshNewsNowAction(): Promise<
	Awaited<ReturnType<typeof refreshNews>> | { error: string }
> {
	const viewer = await getViewer()
	if (!viewer.isAdmin) return { error: 'Forbidden' }

	return refreshNews()
}
