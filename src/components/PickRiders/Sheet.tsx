'use client'

import { useState, useTransition } from 'react'

import { Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle
} from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'

import { savePicksAction } from './actions'
import { RiderTile } from './RiderTile'

export type TPickRider = {
	id: number
	name: string
	number: number
	country_code: string | null
}

type TPickRidersSheet = {
	gpId: number
	gpName: string
	gpRound: number
	viewerId: number
	riders: TPickRider[]
	initialPicks: [number, number, number] | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onSaved: (picks: [number, number, number]) => void
}

export function PickRidersSheet({
	gpId,
	gpName,
	gpRound,
	viewerId,
	riders,
	initialPicks,
	open,
	onOpenChange,
	onSaved
}: TPickRidersSheet) {
	const [selected, setSelected] = useState<number[]>(
		initialPicks ? [initialPicks[0], initialPicks[1], initialPicks[2]] : []
	)
	const [isPending, startTransition] = useTransition()

	const isComplete = selected.length === 3

	function handleTileClick(riderId: number) {
		setSelected((prev) => {
			const idx = prev.indexOf(riderId)
			if (idx !== -1) return prev.filter((id) => id !== riderId)
			if (prev.length >= 3) return prev
			return [...prev, riderId]
		})
	}

	function handleSave() {
		if (!isComplete) return

		startTransition(async () => {
			const result = await savePicksAction(
				gpId,
				viewerId,
				selected as [number, number, number]
			)

			if (result.error) {
				toast.error(result.error)
				return
			}

			toast.success('Picks saved!')
			onSaved(selected as [number, number, number])
			onOpenChange(false)
		})
	}

	function handleOpenChange(nextOpen: boolean) {
		if (nextOpen) {
			setSelected(
				initialPicks ? [initialPicks[0], initialPicks[1], initialPicks[2]] : []
			)
		}
		onOpenChange(nextOpen)
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent
				side="bottom"
				className="flex max-h-[90dvh] flex-col gap-0"
			>
				<SheetHeader className="border-b pb-3">
					<SheetTitle>Pick your 3 riders</SheetTitle>
					<SheetDescription>
						Round {gpRound} · {gpName}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto p-4">
					<div className="grid grid-cols-4 gap-2">
						{riders.map((rider) => (
							<RiderTile
								key={rider.id}
								rider={rider}
								slotIndex={selected.indexOf(rider.id)}
								isDimmed={isComplete && !selected.includes(rider.id)}
								onClick={() => handleTileClick(rider.id)}
							/>
						))}

						{riders.length < 16 && (
							<div className="relative flex cursor-not-allowed flex-col items-center gap-1 rounded-lg p-2 opacity-40">
								<div className="bg-muted flex size-14 items-center justify-center rounded-full">
									<span className="text-muted-foreground text-lg">?</span>
								</div>
								<div className="flex w-full flex-col items-center gap-0.5">
									<span className="text-center text-xs leading-tight font-black uppercase">
										Wild Card
									</span>
									<span className="text-muted-foreground text-xs">TBD</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<SheetFooter className="border-t pt-3">
					<Button
						variant="success"
						size="lg"
						className="w-full"
						disabled={!isComplete || isPending}
						onClick={handleSave}
					>
						{isPending ? (
							<>
								<Spinner className="size-4" />
								Saving…
							</>
						) : (
							<>
								Save picks
								<Save className="size-4" />
							</>
						)}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
