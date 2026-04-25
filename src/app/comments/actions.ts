'use server'

import { updateTag } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'
import { db } from '@/lib/db'
import { getViewer } from '@/lib/auth/get-viewer'

export async function postCommentAction(
	comment: string,
	gpId: number | null,
	replyToId: number | null
): Promise<{ error?: string }> {
	const viewer = await getViewer()
	if (!viewer.db?.id) return { error: 'Not authenticated' }

	const trimmed = comment.trim()
	if (!trimmed) return { error: 'Empty comment' }

	await db
		.insertInto('comments')
		.values({
			comment: trimmed,
			user_id: viewer.db.id,
			gp_id: gpId,
			reply_to_id: replyToId,
		})
		.execute()

	updateTag(cacheTags.comments)

	return {}
}
