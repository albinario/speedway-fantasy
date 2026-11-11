'use client'

import { useState } from 'react'

import { useTranslations } from 'next-intl'

import { SegmentedControl } from '@/components/SegmentedControl'

export type TPlayersRidersView = 'players' | 'riders'

type TPlayersRidersToggle = {
	// Starting tab, read from ?view on the server so links and refreshes keep it
	initialView: TPlayersRidersView
	players: React.ReactNode
	riders: React.ReactNode
}

/**
 * Players/riders switch. Both tables are rendered up front, so switching is
 * instant; the URL is updated in place (no server fetch, no history entry).
 */
export function PlayersRidersToggle({
	initialView,
	players,
	riders
}: TPlayersRidersToggle) {
	const t = useTranslations('Common')
	const [view, setView] = useState(initialView)

	function changeView(next: TPlayersRidersView) {
		setView(next)

		const params = new URLSearchParams(window.location.search)
		params.set('view', next)
		window.history.replaceState(null, '', `?${params.toString()}`)
	}

	return (
		<>
			<SegmentedControl
				options={[
					{ value: 'players', label: t('players') },
					{ value: 'riders', label: t('riders') }
				]}
				value={view}
				onChange={changeView}
			/>

			{view === 'players' ? players : riders}
		</>
	)
}
