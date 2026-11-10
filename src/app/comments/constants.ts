export const REACTION_EMOJIS = ['👍', '❤️', '😂', '🔥', '😮', '👎'] as const
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number]
export type Reaction = {
	emoji: string
	count: number
	user_ids: number[]
	user_names: string[]
}
