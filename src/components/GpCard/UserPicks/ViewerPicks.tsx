'use client'

import { useState } from 'react'

import { ChevronDown } from 'lucide-react'

import { InfoBox } from '@/components/InfoBox'
import { RiderTile } from '@/components/PickRiders/RiderTile'
import { PickRidersSheet, type TPickRider } from '@/components/PickRiders/Sheet'
import { Button } from '@/components/ui/button'

import { RiderTilesEmpty } from './RiderTilesEmpty'

type TViewerPicks = {
	gpId: number
	gpName: string
	gpRound: number
	gpCountryCode: string
	viewerId: number
	riders: TPickRider[]
	initialPicks: [number, number, number] | null
	canEdit: boolean
}

export function ViewerPicks({
	gpId,
	gpName,
	gpRound,
	gpCountryCode,
	viewerId,
	riders,
	initialPicks,
	canEdit
}: TViewerPicks) {
	const [open, setOpen] = useState(false)
	const [savedPicks, setSavedPicks] = useState(initialPicks)

	const pickedRiders = savedPicks
		?.map((id) => riders.find((r) => r.id === id))
		.filter(Boolean) as TPickRider[] | undefined

	return (
		<>
			<InfoBox className="flex flex-col gap-4">
				<div className="flex items-center justify-between font-black uppercase">
					<span>My picked riders</span>

					{canEdit && (
						<Button
							variant="link"
							className="h-auto gap-0.5 p-0 text-green-400 normal-case"
							onClick={() => setOpen(true)}
						>
							{savedPicks ? 'Edit' : 'Pick riders'}
							<ChevronDown className="size-3.5" />
						</Button>
					)}
				</div>

				<div className="grid grid-cols-3 gap-2">
					{pickedRiders && pickedRiders.length > 0 ? (
						pickedRiders.map((rider) => (
							<RiderTile key={rider.id} rider={rider} linked hideFirstName />
						))
					) : (
						<RiderTilesEmpty count={3} variant="red" />
					)}
				</div>
			</InfoBox>

			{canEdit && (
				<PickRidersSheet
					gpCountryCode={gpCountryCode}
					gpId={gpId}
					gpName={gpName}
					gpRound={gpRound}
					initialPicks={savedPicks}
					onOpenChange={setOpen}
					onSaved={setSavedPicks}
					open={open}
					riders={riders}
					viewerId={viewerId}
				/>
			)}
		</>
	)
}
