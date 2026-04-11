'use client'

import { useState } from 'react'

import { ListCheck } from 'lucide-react'

import { RiderPlaceholder } from '@/components/RiderPlaceholder'
import { Button } from '@/components/ui/button'

import { RiderInfo } from '../RiderInfo'
import { PickRidersSheet, type TPickRider } from './Sheet'

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
			<div className="bg-muted/50 flex flex-col gap-3 rounded-md p-3">
				<div className="flex flex-wrap gap-x-2 gap-y-1">
					<span
						className={`text-sm ${savedPicks ? 'text-green-400/70' : 'text-yellow-400/70'}`}
					>
						{savedPicks ? 'Confirmed' : 'Pending'}
					</span>

					<div className="ml-auto flex gap-6">
						{pickedRiders && pickedRiders.length > 0
							? pickedRiders.map((rider) => (
									<RiderInfo
										key={rider.id}
										countryCode={rider.country_code}
										imageSize={14}
										name={rider.name.split(' ').pop() ?? ''}
										number={rider.number}
										riderId={rider.id}
										stack
									/>
								))
							: [0, 1, 2].map((i) => <RiderPlaceholder key={i} />)}
					</div>
				</div>

				<Button
					variant={savedPicks ? 'success' : 'warning'}
					className="w-full"
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
