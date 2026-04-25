'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { CornerDownLeft, Send, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/UserAvatar'
import { UserName } from '@/components/UserName'
import { cn } from '@/lib/utils'

import { postCommentAction } from './actions'

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
}

type ThreadedComment = CommentRow & { replies: CommentRow[] }

type ReplyTarget = { id: number; name: string }

type Props = {
	comments: CommentRow[]
	viewerId: number | undefined
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
}

function ReplyBubble({ reply, viewerId }: ReplyBubbleProps) {
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
				</div>
			</div>
		</div>
	)
}

type CommentBubbleProps = {
	comment: ThreadedComment
	onReply: (target: ReplyTarget) => void
	viewerId: number | undefined
}

function CommentBubble({ comment, onReply, viewerId }: CommentBubbleProps) {
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
				<div className="border-border bg-card rounded-lg rounded-tl-none border px-3 py-2.5 text-sm leading-relaxed">
					{comment.comment}
				</div>
				{comment.replies.length > 0 && (
					<div className="border-border mt-3 ml-2 space-y-3 border-l-2 pl-3">
						{comment.replies.map((reply) => (
							<ReplyBubble key={reply.id} reply={reply} viewerId={viewerId} />
						))}
					</div>
				)}
				{viewerId != null && (
					<Button
						variant="ghost"
						size="xs"
						onClick={() => onReply({ id: comment.id, name })}
						className="text-muted-foreground mt-1"
					>
						<CornerDownLeft />
						Reply
					</Button>
				)}
			</div>
		</div>
	)
}

export function CommentsView({ comments, viewerId }: Props) {
	const [message, setMessage] = useState('')
	const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null)
	const [isPending, startTransition] = useTransition()
	const bottomRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const isInitial = useRef(true)
	const router = useRouter()

	const threaded = threadComments(comments).slice(-10)
	const canSend = message.trim().length > 0

	useEffect(() => {
		const behavior = isInitial.current ? ('instant' as ScrollBehavior) : 'smooth'
		isInitial.current = false
		bottomRef.current?.scrollIntoView({ behavior })
	}, [comments])

	function handleReply(target: ReplyTarget) {
		setReplyingTo(target)
		inputRef.current?.focus()
	}

	function handleSubmit() {
		if (!canSend || isPending) return
		const text = message
		startTransition(async () => {
			await postCommentAction(text, null, replyingTo?.id ?? null)
			setMessage('')
			setReplyingTo(null)
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
		<div className="mx-auto max-w-2xl">
			<div className="space-y-5 pb-10">
				{threaded.map((comment) => (
					<CommentBubble
						key={comment.id}
						comment={comment}
						onReply={handleReply}
						viewerId={viewerId}
					/>
				))}
				<div ref={bottomRef} />
			</div>

			{viewerId != null ? (
				<div className="border-border bg-background fixed right-0 bottom-[70px] left-0 z-10 border-t px-4 py-3">
					<div className="mx-auto max-w-2xl">
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
										: 'Write a message…'
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
					</div>
				</div>
			) : null}
		</div>
	)
}
