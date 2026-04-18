'use client'

import { useState } from 'react'

import { PickRidersSheet } from '@/components/PickRidersSheet'
import type { TRider } from '@/components/RiderTile'
import { Button } from '@/components/ui/button'

type TPickRidersButton = {
	gpId: number
	gpName: string
	gpRound: number
	gpCountryCode: string
	viewerId: number
	riders: TRider[]
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
