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
	updateTag(cacheTags.commentReads)

	return {}
}

export async function toggleReactionAction(
	commentId: number,
	emoji: string
): Promise<void> {
	const viewer = await getViewer()
	if (!viewer.db?.id) return

	const existing = await db
		.selectFrom('comment_reactions')
		.select('id')
		.where('comment_id', '=', commentId)
		.where('user_id', '=', viewer.db.id)
		.where('emoji', '=', emoji)
		.executeTakeFirst()

	if (existing) {
		await db
			.deleteFrom('comment_reactions')
			.where('id', '=', existing.id)
			.execute()
	} else {
		await db
			.insertInto('comment_reactions')
			.values({ comment_id: commentId, user_id: viewer.db.id, emoji })
			.execute()
	}

	updateTag(cacheTags.reactions)
}

export async function markCommentsReadAction(): Promise<void> {
	const viewer = await getViewer()
	if (!viewer.db?.id) return

	await db
		.updateTable('users')
		.set({ comments_last_read_at: new Date() })
		.where('id', '=', viewer.db.id)
		.execute()

	updateTag(cacheTags.commentReads)
}
