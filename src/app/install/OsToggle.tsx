'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Apple, Smartphone } from 'lucide-react'

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
			options={[
				{
					value: 'ios',
					label: (
						<span className="flex items-center gap-1.5">
							<Apple className="size-4" /> iPhone
						</span>
					)
				},
				{
					value: 'android',
					label: (
						<span className="flex items-center gap-1.5">
							<Smartphone className="size-4" /> Android
						</span>
					)
				}
			]}
			value={os}
			onChange={setOs}
		/>
	)
}
