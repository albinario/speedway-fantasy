'use client'

import { useTransition } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { LoadingFallback } from '@/components/LoadingFallback'
import { SegmentedControl } from '@/components/SegmentedControl'

type TShowOption = 'recent' | 'all'

type TShowOlderToggle = {
	checked: boolean
	children: React.ReactNode
}

export function ShowOlderToggle({ checked, children }: TShowOlderToggle) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()

	function setShow(next: TShowOption) {
		const params = new URLSearchParams(searchParams.toString())
		if (next === 'all') {
			params.set('show', 'all')
		} else {
			params.delete('show')
		}
		startTransition(() => {
			router.push(`?${params.toString()}`)
		})
	}

	return (
		<>
			<SegmentedControl
				onChange={setShow}
				options={[
					{ value: 'recent', label: 'Recent' },
					{ value: 'all', label: 'All GPs' }
				]}
				value={checked ? 'all' : 'recent'}
			/>

			{isPending ? <LoadingFallback /> : children}
		</>
	)
}
