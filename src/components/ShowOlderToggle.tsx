'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { SegmentedControl } from '@/components/SegmentedControl'

type TShowOption = 'recent' | 'all'

export function ShowOlderToggle({ checked }: { checked: boolean }) {
	const router = useRouter()
	const searchParams = useSearchParams()

	function setShow(next: TShowOption) {
		const params = new URLSearchParams(searchParams.toString())
		if (next === 'all') {
			params.set('show', 'all')
		} else {
			params.delete('show')
		}
		router.push(`?${params.toString()}`)
	}

	return (
		<SegmentedControl
			onChange={setShow}
			options={[
				{ value: 'recent', label: 'Recent' },
				{ value: 'all', label: 'All GPs' }
			]}
			value={checked ? 'all' : 'recent'}
		/>
	)
}
