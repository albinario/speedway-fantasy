'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function ShowOlderToggle({ checked }: { checked: boolean }) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()

	function handleChange(value: boolean) {
		const params = new URLSearchParams(searchParams.toString())
		if (value) {
			params.set('show', 'all')
		} else {
			params.delete('show')
		}
		startTransition(() => router.push(`?${params.toString()}`))
	}

	return (
		<div className="flex items-center gap-2 px-3 sm:px-0">
			<Switch
				id="show-older"
				checked={checked}
				disabled={isPending}
				onCheckedChange={handleChange}
			/>
			<Label htmlFor="show-older" className="cursor-pointer">
				Show older GPs
			</Label>
		</div>
	)
}
