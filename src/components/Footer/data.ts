import { unstable_cache } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'
import { db } from '@/lib/db'

export const getUnreadCommentsCount = unstable_cache(
	async (userId: number): Promise<number> => {
		const user = await db
			.selectFrom('users')
			.select('comments_last_read_at')
			.where('id', '=', userId)
			.executeTakeFirst()

		if (!user?.comments_last_read_at) return 0

		const result = await db
			.selectFrom('comments')
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.where('created_at', '>', new Date(user.comments_last_read_at))
			.where('user_id', '!=', userId)
			.executeTakeFirst()

		return Number(result?.count ?? 0)
	},
	['unread-comments-count'],
	{ tags: [cacheTags.commentReads] }
)
