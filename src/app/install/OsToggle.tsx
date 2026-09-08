'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { SegmentedControl } from '@/components/SegmentedControl'

type TOs = 'ios' | 'android'

export function OsToggle({ os }: { os: TOs }) {
	const router = useRouter()
	const searchParams = useSearchParams()

	function setOs(next: TOs) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('os', next)
		router.push(`?${params.toString()}`)
	}

	return (
		<SegmentedControl
			onChange={setOs}
			options={[
				{
					value: 'ios',
					label: 'iPhone'
				},
				{
					value: 'android',
					label: 'Android'
				}
			]}
			value={os}
		/>
	)
}
