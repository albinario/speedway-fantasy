export const metaData = {
	title: 'Comments',
	description: 'Browse and view the comments'
}

export const fetchFailed = 'Failed to load comments'

export const noData = 'No comments in the database.'

export const REACTION_EMOJIS = ['👍', '❤️', '😂', '🔥', '😮', '👎'] as const
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number]
export type Reaction = { emoji: string; count: number; user_ids: number[] }
