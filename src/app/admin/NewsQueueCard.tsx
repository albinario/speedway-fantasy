'use client'

import { useState, useTransition } from 'react'

import Link from 'next/link'

import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { refreshNewsNowAction } from './news/actions'

export function NewsQueueCard() {
	const [isPending, startTransition] = useTransition()
	const [result, setResult] = useState<string | null>(null)

	function handleClick() {
		startTransition(async () => {
			const outcome = await refreshNewsNowAction()
			if ('error' in outcome) {
				toast.error(outcome.error)
				return
			}
			setResult(
				`Fetched ${outcome.fetched} — inserted ${outcome.inserted}, ` +
					`already seen ${outcome.skippedExisting}, not GP-relevant ${outcome.skippedNotRelevant}, ` +
					`errors ${outcome.errors}`
			)
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>News</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={handleClick} disabled={isPending}>
						<RefreshCw className={isPending ? 'animate-spin' : ''} />
						Refresh now
					</Button>

					<Button asChild variant="outline">
						<Link href="/admin/news">Review queue</Link>
					</Button>
				</div>

				{result && <p className="text-muted-foreground text-sm">{result}</p>}
			</CardContent>
		</Card>
	)
}
