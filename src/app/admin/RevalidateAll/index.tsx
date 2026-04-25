'use client'

import { useState, useTransition } from 'react'

import { Check, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { revalidateAllAction } from './actions'

export function RevalidateAll() {
	const [done, setDone] = useState(false)
	const [isPending, startTransition] = useTransition()

	function handleClick() {
		startTransition(async () => {
			await revalidateAllAction()
			setDone(true)
			setTimeout(() => setDone(false), 3000)
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Cache</CardTitle>
			</CardHeader>
			<CardContent>
				<Button variant="outline" onClick={handleClick} disabled={isPending}>
					{done ? (
						<><Check className="text-green-400" /> Revalidated</>
					) : (
						<><RefreshCw className={isPending ? 'animate-spin' : ''} /> Revalidate all</>
					)}
				</Button>
			</CardContent>
		</Card>
	)
}
