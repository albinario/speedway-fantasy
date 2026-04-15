'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { PickRidersSheet, type TPickRider } from '@/components/PickRiders/Sheet'

type TPickRidersButton = {
	gpId: number
	gpName: string
	gpRound: number
	gpCountryCode: string
	viewerId: number
	riders: TPickRider[]
	initialPicks: [number, number, number] | null
}

export function PickRidersButton({
	gpId,
	gpName,
	gpRound,
	gpCountryCode,
	viewerId,
	riders,
	initialPicks
}: TPickRidersButton) {
	const [open, setOpen] = useState(false)
	const [savedPicks, setSavedPicks] = useState(initialPicks)

	return (
		<>
			<Button variant="outline" size="lg" onClick={() => setOpen(true)}>
				Pick riders
			</Button>

			<PickRidersSheet
				gpId={gpId}
				gpName={gpName}
				gpRound={gpRound}
				gpCountryCode={gpCountryCode}
				viewerId={viewerId}
				riders={riders}
				initialPicks={savedPicks}
				open={open}
				onOpenChange={setOpen}
				onSaved={setSavedPicks}
			/>
		</>
	)
}
