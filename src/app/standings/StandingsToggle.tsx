'use client'

import { useTransition } from 'react'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

import { LoadingFallback } from '@/components/LoadingFallback'
import { SegmentedControl } from '@/components/SegmentedControl'

type TView = 'players' | 'riders'

type TStandingsToggle = {
	view: TView
	children: React.ReactNode
}

export function StandingsToggle({ view, children }: TStandingsToggle) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()
	const t = useTranslations('Common')

	function setView(next: TView) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('view', next)
		startTransition(() => {
			router.push(`?${params.toString()}`)
		})
	}

	return (
		<>
			<SegmentedControl
				options={[
					{ value: 'players', label: t('players') },
					{ value: 'riders', label: t('riders') }
				]}
				value={view}
				onChange={setView}
			/>

			{isPending ? <LoadingFallback /> : children}
		</>
	)
}
