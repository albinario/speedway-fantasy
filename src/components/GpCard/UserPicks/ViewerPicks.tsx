'use client'

import { useState } from 'react'

import { ChevronDown } from 'lucide-react'

import { PickRidersSheet } from '@/components/PickRidersSheet'
import { RiderTile, type TRider } from '@/components/RiderTile'
import { Button } from '@/components/ui/button'

import { RiderTilesEmpty } from '../../RiderTile/Empty'

type TViewerPicks = {
	gpId: number
	gpName: string
	gpRound: number
	gpCountryCode: string
	viewerId: number
	riders: TRider[]
	initialPicks: [number, number, number] | null
}

export function ViewerPicks({
	gpId,
	gpName,
	gpRound,
	gpCountryCode,
	viewerId,
	riders,
	initialPicks
}: TViewerPicks) {
	const [open, setOpen] = useState(false)
	const [savedPicks, setSavedPicks] = useState(initialPicks)

	const pickedRiders = savedPicks
		?.map((id) => riders.find((r) => r.id === id))
		.filter(Boolean) as TRider[] | undefined

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between font-black uppercase">
					<span>My picked riders</span>

					<Button
						variant="link"
						className="h-auto gap-0.5 p-0 text-green-400 normal-case"
						onClick={() => setOpen(true)}
					>
						{savedPicks ? 'Edit' : 'Pick riders'}

						<ChevronDown className={`size-3.5 ${open ? 'rotate-180' : ''}`} />
					</Button>
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
			</div>

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
		</>
	)
}
