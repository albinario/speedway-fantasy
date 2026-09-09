'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { approveNewsItemAction, rejectNewsItemAction } from './actions'
import type { getPendingNewsItems } from './data'

type TNewsQueue = {
	items: Awaited<ReturnType<typeof getPendingNewsItems>>
}

export function NewsQueue({ items: initialItems }: TNewsQueue) {
	const [items, setItems] = useState(initialItems)

	if (!items.length) {
		return <p className="text-muted-foreground">No pending news items.</p>
	}

	return (
		<div className="flex flex-col gap-4">
			{items.map((item) => (
				<NewsQueueItem
					key={item.id}
					item={item}
					onResolved={(id) =>
						setItems((prev) => prev.filter((i) => i.id !== id))
					}
				/>
			))}
		</div>
	)
}

type TNewsQueueItem = {
	item: TNewsQueue['items'][number]
	onResolved: (id: number) => void
}

function NewsQueueItem({ item, onResolved }: TNewsQueueItem) {
	const [headline, setHeadline] = useState(item.headline)
	const [blurb, setBlurb] = useState(item.blurb)
	const [isPending, startTransition] = useTransition()

	function handleApprove() {
		startTransition(async () => {
			const result = await approveNewsItemAction(item.id, headline, blurb)
			if (result.error) {
				toast.error(result.error)
				return
			}
			toast.success('News item published')
			onResolved(item.id)
		})
	}

	function handleReject() {
		startTransition(async () => {
			const result = await rejectNewsItemAction(item.id)
			if (result.error) {
				toast.error(result.error)
				return
			}
			toast.success('News item rejected')
			onResolved(item.id)
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{item.source_title}</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-3">
				<Input
					disabled={isPending}
					onChange={(e) => setHeadline(e.target.value)}
					value={headline}
				/>

				<Textarea
					disabled={isPending}
					onChange={(e) => setBlurb(e.target.value)}
					rows={3}
					value={blurb}
				/>

				<a
					className="text-muted-foreground text-xs hover:underline"
					href={item.source_url}
					rel="noopener noreferrer"
					target="_blank"
				>
					View source →
				</a>
			</CardContent>

			<CardFooter className="gap-2">
				<Button disabled={isPending} onClick={handleApprove}>
					Approve
				</Button>

				<Button disabled={isPending} onClick={handleReject} variant="outline">
					Reject
				</Button>
			</CardFooter>
		</Card>
	)
}
