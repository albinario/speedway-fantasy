'use client'

import { useState } from 'react'

import { ListCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { PickedRiders } from './PickedRiders'
import { PickRidersSheet, type TPickRider } from './PickRidersSheet'
import { RiderPlaceholder } from './RiderPlaceholder'

type TPickRidersTrigger = {
	gpId: number
	gpName: string
	gpRound: number

	viewerId: number
	riders: TPickRider[]
	existingPicks: {
		rider_1_id: number
		rider_2_id: number
		rider_3_id: number
	} | null
}

export function PickRidersTrigger({
	gpId,
	gpName,
	gpRound,
	viewerId,
	riders,
	existingPicks
}: TPickRidersTrigger) {
	const [open, setOpen] = useState(false)
	const [savedPicks, setSavedPicks] = useState<[number, number, number] | null>(
		existingPicks
			? [
					existingPicks.rider_1_id,
					existingPicks.rider_2_id,
					existingPicks.rider_3_id
				]
			: null
	)

	const pickedRiders = savedPicks
		?.map((id) => riders.find((r) => r.id === id))
		.filter(Boolean) as TPickRider[] | undefined

	return (
		<>
			<div className="bg-muted/50 flex flex-col items-center gap-3 rounded-md px-3 py-3">
				<span
					className={`self-start text-xs ${savedPicks ? 'text-green-400/70' : 'text-yellow-400/70'}`}
				>
					{savedPicks ? 'Registration confirmed' : 'Picks pending'}
				</span>
				<div className="flex items-center gap-6">
					{pickedRiders ? (
						<PickedRiders riders={pickedRiders} />
					) : (
						[0, 1, 2].map((i) => (
							<div key={i} className="flex flex-col items-center gap-0.5">
								<RiderPlaceholder className="size-8" />
							</div>
						))
					)}
				</div>

				<Button
					variant="outline"
					className={`w-full ${savedPicks ? 'border-green-400/60! text-green-400/60 hover:bg-green-400/10 hover:text-green-400/80' : 'border-yellow-400/60! text-yellow-400/60 hover:bg-yellow-400/10 hover:text-yellow-400/80'}`}
					onClick={() => setOpen(true)}
				>
					{savedPicks ? 'Edit your picks' : 'Pick your riders'}
					<ListCheck className="size-4" />
				</Button>
			</div>

			<PickRidersSheet
				gpId={gpId}
				gpName={gpName}
				gpRound={gpRound}
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
