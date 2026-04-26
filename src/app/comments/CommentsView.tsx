'use client'

import {
	useEffect,
	useMemo,
	useOptimistic,
	useRef,
	useState,
	useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { CornerDownLeft, LogIn, Send, SmilePlus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/UserAvatar'
import { UserName } from '@/components/UserName'
import { cn } from '@/lib/utils'

import {
	markCommentsReadAction,
	postCommentAction,
	toggleReactionAction
} from './actions'
import { type Reaction, REACTION_EMOJIS } from './constants'

type CommentRow = {
	id: number
	comment: string
	created_at: Date | string
	reply_to_id: number | null
	user_id: number
	gp_id: number | null
	first_name: string | null
	last_name: string | null
	stars: number[] | null
	gp_start_date: Date | string | null
	city_name: string | null
	country_code: string | null
	reactions: Reaction[]
}

type ThreadedComment = CommentRow & { replies: CommentRow[] }

type ReplyTarget = { id: number; name: string }

type Props = {
	comments: CommentRow[]
	viewerId: number | undefined
	lastReadAt: Date | null
}

function threadComments(flat: CommentRow[]): ThreadedComment[] {
	const replyMap = new Map<number, CommentRow[]>()
	const topLevel: CommentRow[] = []

	for (const c of flat) {
		if (c.reply_to_id == null) {
			topLevel.push(c)
		} else {
			const arr = replyMap.get(c.reply_to_id) ?? []
			arr.push(c)
			replyMap.set(c.reply_to_id, arr)
		}
	}

	return topLevel.map((c) => ({ ...c, replies: replyMap.get(c.id) ?? [] }))
}

function countryFlag(code: string | null): string {
	if (!code) return '🏁'
	return [...code.toUpperCase()]
		.map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
		.join('')
}

function formatTime(iso: Date | string): string {
	const d = new Date(iso)
	const now = new Date()
	if (d.toDateString() === now.toDateString()) {
		return d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
	}
	const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
	if (d.getFullYear() !== now.getFullYear()) options.year = 'numeric'
	return d.toLocaleDateString('sv-SE', options)
}

function displayName(first: string | null, last: string | null): string {
	return [first, last].filter(Boolean).join(' ') || 'Unknown'
}

type GPBadgeProps = {
	cityName: string
	countryCode: string | null
	startDate: Date | string
}

function GPBadge({ cityName, countryCode, startDate }: GPBadgeProps) {
	const year = new Date(startDate).getFullYear()
	const currentYear = new Date().getFullYear()
	return (
		<span className="border-border bg-muted inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-bold tracking-wide uppercase">
			{countryFlag(countryCode)} {cityName}
			{year !== currentYear ? ` ${year}` : ''}
		</span>
	)
}

type ReplyBubbleProps = {
	reply: CommentRow
	viewerId: number | undefined
	onReaction: (commentId: number, emoji: string) => void
}

function ReplyBubble({ reply, viewerId, onReaction }: ReplyBubbleProps) {
	return (
		<div className="flex gap-2">
			<UserAvatar
				firstName={reply.first_name}
				lastName={reply.last_name}
				className="h-6 w-6 text-[10px]"
			/>
			<div className="min-w-0 flex-1">
				<div className="mb-1 flex items-baseline gap-2">
					<UserName
						firstName={reply.first_name}
						lastName={reply.last_name}
						userId={reply.user_id}
						stars={reply.stars}
						isViewer={reply.user_id === viewerId}
						className="text-xs font-bold"
					/>
					<span className="text-muted-foreground ml-auto text-xs">
						{formatTime(reply.created_at)}
					</span>
				</div>
				<div className="bg-muted/40 rounded-lg rounded-tl-none px-3 py-2 text-sm leading-relaxed">
					{reply.comment}
					{(reply.reactions.length > 0 || viewerId != null) && (
						<div className="mt-2 flex flex-wrap items-center gap-1">
							{viewerId != null && (
								<EmojiPicker onSelect={(emoji) => onReaction(reply.id, emoji)} />
							)}
							{reply.reactions.map((r) => {
								const reacted =
									viewerId != null && r.user_ids.includes(viewerId)
								return (
									<button
										key={r.emoji}
										onClick={() => onReaction(reply.id, r.emoji)}
										className={cn(
											'text-muted-foreground flex items-center gap-0.5 rounded px-1 py-0.5 text-xs transition-colors',
											reacted
												? 'bg-brand-red/10 text-brand-red'
												: 'hover:bg-muted/60'
										)}
									>
										{r.emoji} <span className="tabular-nums">{r.count}</span>
									</button>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
	const [open, setOpen] = useState(false)
	return (
		<div className="relative">
			<Button
				variant="ghost"
				size="icon-xs"
				className="text-muted-foreground"
				onClick={() => setOpen((o) => !o)}
			>
				<SmilePlus />
			</Button>
			{open && (
				<div className="border-border bg-card absolute bottom-full left-0 mb-1 flex gap-1 rounded-lg border shadow-lg">
					{REACTION_EMOJIS.map((emoji) => (
						<button
							key={emoji}
							className="hover:bg-muted rounded p-1 text-base leading-none transition-colors"
							onClick={() => {
								onSelect(emoji)
								setOpen(false)
							}}
						>
							{emoji}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

type CommentBubbleProps = {
	comment: ThreadedComment
	onReply: (target: ReplyTarget) => void
	onReaction: (commentId: number, emoji: string) => void
	viewerId: number | undefined
	isUnread: boolean
}

function CommentBubble({
	comment,
	onReply,
	onReaction,
	viewerId,
	isUnread
}: CommentBubbleProps) {
	const name = displayName(comment.first_name, comment.last_name)
	return (
		<div className="flex gap-3 px-2">
			<UserAvatar
				firstName={comment.first_name}
				lastName={comment.last_name}
				className="h-8 w-8 text-xs"
			/>
			<div className="min-w-0 flex-1">
				<div className="mb-1 flex items-center justify-between gap-2">
					<div className="flex min-w-0 flex-wrap items-center gap-1.5">
						<UserName
							firstName={comment.first_name}
							lastName={comment.last_name}
							userId={comment.user_id}
							stars={comment.stars}
							isViewer={comment.user_id === viewerId}
							className="text-sm leading-none font-bold"
						/>
						{comment.gp_start_date != null && comment.city_name != null && (
							<GPBadge
								cityName={comment.city_name}
								countryCode={comment.country_code}
								startDate={comment.gp_start_date}
							/>
						)}
					</div>
					<span className="text-muted-foreground shrink-0 text-xs">
						{formatTime(comment.created_at)}
					</span>
				</div>
				<div
					className={cn(
						'border-border bg-card rounded-lg rounded-tl-none border px-3 py-2.5 text-sm leading-relaxed',
						isUnread && 'border-emerald-500'
					)}
				>
					{comment.comment}
					{(comment.reactions.length > 0 || viewerId != null) && (
						<div className="mt-1 flex flex-wrap items-center gap-1">
							{viewerId != null && (
								<EmojiPicker onSelect={(emoji) => onReaction(comment.id, emoji)} />
							)}
							{comment.reactions.map((r) => {
								const reacted =
									viewerId != null && r.user_ids.includes(viewerId)
								return (
									<button
										key={r.emoji}
										onClick={() => onReaction(comment.id, r.emoji)}
										className={cn(
											'text-muted-foreground flex items-center gap-0.5 rounded px-1 py-0.5 text-xs transition-colors',
											reacted
												? 'bg-brand-red/10 text-brand-red'
												: 'hover:bg-muted/60'
										)}
									>
										{r.emoji} <span className="tabular-nums">{r.count}</span>
									</button>
								)
							})}
						</div>
					)}
				</div>
				{comment.replies.length > 0 && (
					<div className="border-border mt-3 ml-2 space-y-3 border-l-2 pl-3">
						{comment.replies.map((reply) => (
							<ReplyBubble
								key={reply.id}
								reply={reply}
								viewerId={viewerId}
								onReaction={onReaction}
							/>
						))}
					</div>
				)}
				<div className="mt-1 flex items-center gap-0.5">
					{viewerId != null && (
						<Button
							variant="ghost"
							size="xs"
							onClick={() => onReply({ id: comment.id, name })}
							className="text-muted-foreground"
						>
							<CornerDownLeft />
							Reply
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}

const INITIAL_COUNT = 10
const LOAD_MORE = 10

type OptimisticAction = {
	commentId: number
	emoji: string
	userId: number
	toggle: 'add' | 'remove'
}

function applyOptimisticReaction(
	comments: CommentRow[],
	{ commentId, emoji, userId, toggle }: OptimisticAction
): CommentRow[] {
	return comments.map((c) => {
		if (c.id !== commentId) return c
		const existing = c.reactions.find((r) => r.emoji === emoji)
		let reactions: Reaction[]
		if (toggle === 'add') {
			reactions = existing
				? c.reactions.map((r) =>
						r.emoji === emoji
							? { ...r, count: r.count + 1, user_ids: [...r.user_ids, userId] }
							: r
					)
				: [...c.reactions, { emoji, count: 1, user_ids: [userId] }]
		} else {
			reactions = c.reactions
				.map((r) =>
					r.emoji === emoji
						? {
								...r,
								count: r.count - 1,
								user_ids: r.user_ids.filter((id) => id !== userId)
							}
						: r
				)
				.filter((r) => r.count > 0)
		}
		return { ...c, reactions }
	})
}

export function CommentsView({
	comments,
	viewerId,
	lastReadAt: lastReadAtProp
}: Props) {
	const [lastReadAt] = useState(lastReadAtProp)
	const [message, setMessage] = useState('')
	const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null)
	const [isPending, startTransition] = useTransition()
	const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
	const bottomRef = useRef<HTMLDivElement>(null)
	const topSentinelRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const pendingScroll = useRef<ScrollBehavior | null>(null)
	const isLoadingMore = useRef(false)
	const router = useRouter()

	const [optimisticComments, addOptimistic] = useOptimistic(
		comments,
		applyOptimisticReaction
	)

	const threaded = useMemo(
		() => threadComments(optimisticComments),
		[optimisticComments]
	)
	const visible = threaded.slice(-visibleCount)
	const hasMore = visibleCount < threaded.length
	const canSend = message.trim().length > 0

	// 1. Initial scroll to bottom + mark as read
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'instant' })
		if (viewerId) {
			markCommentsReadAction()
		}
		return () => {
			router.refresh()
		}
	}, [])

	// 2. Scroll after posting — only when explicitly flagged
	useEffect(() => {
		if (!pendingScroll.current) return
		const behavior = pendingScroll.current
		pendingScroll.current = null
		bottomRef.current?.scrollIntoView({ behavior })
	}, [comments])

	// 3. Load more when scrolled to top, one batch at a time
	useEffect(() => {
		isLoadingMore.current = false
	}, [visibleCount])

	useEffect(() => {
		if (!hasMore) return
		const sentinel = topSentinelRef.current
		if (!sentinel) return
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting || isLoadingMore.current) return
				isLoadingMore.current = true
				setVisibleCount((c) => Math.min(c + LOAD_MORE, threaded.length))
			},
			{ threshold: 1 }
		)
		observer.observe(sentinel)
		return () => observer.disconnect()
	}, [hasMore, threaded.length])

	function handleReply(target: ReplyTarget) {
		setReplyingTo(target)
		inputRef.current?.focus()
	}

	function handleReaction(commentId: number, emoji: string) {
		if (!viewerId) return
		const comment = optimisticComments.find((c) => c.id === commentId)
		const reaction = comment?.reactions.find((r) => r.emoji === emoji)
		const toggle = reaction?.user_ids.includes(viewerId) ? 'remove' : 'add'
		startTransition(async () => {
			addOptimistic({ commentId, emoji, userId: viewerId, toggle })
			await toggleReactionAction(commentId, emoji)
			router.refresh()
		})
	}

	function handleSubmit() {
		if (!canSend || isPending) return
		const text = message
		startTransition(async () => {
			await postCommentAction(text, null, replyingTo?.id ?? null)
			setMessage('')
			setReplyingTo(null)
			pendingScroll.current = 'smooth'
			router.refresh()
		})
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	return (
		<>
			<div className="mx-auto max-w-2xl">
				<div className="space-y-5">
					<div ref={topSentinelRef} />
					{visible.map((comment) => (
						<CommentBubble
							key={comment.id}
							comment={comment}
							onReply={handleReply}
							onReaction={handleReaction}
							viewerId={viewerId}
							isUnread={
								lastReadAt != null &&
								comment.user_id !== viewerId &&
								new Date(comment.created_at) > new Date(lastReadAt)
							}
						/>
					))}
					<div ref={bottomRef} />
				</div>
			</div>

			<div className="border-border bg-background sticky bottom-[70px] z-10 border-t px-4 py-3">
				<div className="mx-auto max-w-2xl">
					{viewerId != null ? (
						<>
							{replyingTo && (
								<div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
									<span className="flex items-center gap-1">
										<CornerDownLeft size={11} />
										Replying to {replyingTo.name}
									</span>
									<Button
										variant="ghost"
										size="icon-xs"
										onClick={() => setReplyingTo(null)}
									>
										<X />
									</Button>
								</div>
							)}
							<div className="flex items-center gap-2">
								<Textarea
									ref={inputRef}
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder={
										replyingTo
											? `Reply to ${replyingTo.name}…`
											: 'Write a comment…'
									}
									disabled={isPending}
									rows={1}
									className="flex-1 resize-none"
								/>
								<Button
									size="icon-lg"
									onClick={handleSubmit}
									disabled={!canSend || isPending}
									className={cn(
										canSend && !isPending
											? 'bg-brand-red hover:bg-brand-red/90 border-transparent text-white'
											: ''
									)}
									variant="outline"
								>
									<Send />
								</Button>
							</div>
						</>
					) : (
						<Button asChild className="w-full" variant="outline">
							<a href="/auth/login">
								Sign in to comment <LogIn />
							</a>
						</Button>
					)}
				</div>
			</div>
		</>
	)
}
