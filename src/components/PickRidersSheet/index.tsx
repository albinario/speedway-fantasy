'use client'

import { useRef, useState, useTransition } from 'react'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { Save } from 'lucide-react'
import { toast } from 'sonner'

import { RiderTile } from '@/components/RiderTile'
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
import { accent } from '@/i18n/rich'
import { BUDGET_COINS, canAfford, FIELD_SIZE } from '@/lib/budget'

import { savePicksAction } from './actions'
import type { TFieldRider } from './data'

type TPickRidersSheet = {
	gpId: number
	riders: TFieldRider[]
	initialPicks: [number, number, number] | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onSaved: (picks: [number, number, number]) => void
}

export function PickRidersSheet({
	gpId,
	riders,
	initialPicks,
	open,
	onOpenChange,
	onSaved
}: TPickRidersSheet) {
	const activeIds = new Set(riders.map((r) => r.id))
	const [selectedState, setSelected] = useState<number[]>(
		initialPicks
			? [initialPicks[0], initialPicks[1], initialPicks[2]].filter((id) =>
					activeIds.has(id)
				)
			: []
	)
	// Riders that left the field after a price refresh drop out of the selection
	const selected = selectedState.filter((id) => activeIds.has(id))
	const [isPending, startTransition] = useTransition()
	const t = useTranslations('PickRiders')
	const tCommon = useTranslations('Common')

	const isComplete = selected.length === 3
	const selectedRiders = riders.filter((r) => selected.includes(r.id))
	const router = useRouter()
	const spent = selectedRiders.reduce((sum, r) => sum + (r.coins ?? 0), 0)

	function handleTileClick(riderId: number) {
		setSelected((all) => {
			const prev = all.filter((id) => activeIds.has(id))
			const idx = prev.indexOf(riderId)
			if (idx !== -1) return prev.filter((id) => id !== riderId)
			if (prev.length >= 3) return prev
			return [...prev, riderId]
		})
	}

	// Blocks a second click before isPending has re-rendered the button
	const isSaving = useRef(false)

	function handleSave() {
		if (!isComplete || isSaving.current) return
		isSaving.current = true

		startTransition(async () => {
			try {
				const result = await savePicksAction(
					gpId,
					selected as [number, number, number],
					Object.fromEntries(selectedRiders.map((r) => [r.id, r.coins]))
				)

				if (result.error) {
					toast.error(result.error)
					// Stay open with the selection; the new prices stream in
					if (result.pricesChanged) router.refresh()
					return
				}

				toast.success(t('saved'))
				onSaved(selected as [number, number, number])
				onOpenChange(false)
			} finally {
				isSaving.current = false
			}
		})
	}

	function handleOpenChange(nextOpen: boolean) {
		if (nextOpen) {
			setSelected(
				initialPicks
					? [initialPicks[0], initialPicks[1], initialPicks[2]].filter((id) =>
							activeIds.has(id)
						)
					: []
			)
		}
		onOpenChange(nextOpen)
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent side="bottom" className="flex max-h-[90dvh] flex-col gap-0">
				<SheetHeader className="border-b pb-3">
					<SheetTitle className="font-black uppercase">
						{t.rich('title', { accent })}
					</SheetTitle>

					<SheetDescription>
						{t.rich('budget', { spent, budget: BUDGET_COINS, accent })}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto p-4">
					<div className="grid grid-cols-4 gap-2">
						{riders.map((rider) => {
							const isSelected = selected.includes(rider.id)
							const isPickable =
								isSelected || canAfford(rider, selectedRiders, riders)

							return (
								<RiderTile
									key={rider.id}
									rider={rider}
									hideFirstName
									coins={rider.coins}
									className={rider.isOut ? 'ring-1 ring-red-400/60' : undefined}
									isSelected={isSelected}
									isDimmed={!isPickable}
									onClick={
										isPickable ? () => handleTileClick(rider.id) : undefined
									}
								/>
							)
						})}

						{riders.filter((r) => !r.isOut).length < FIELD_SIZE && (
							<div className="relative flex cursor-not-allowed flex-col items-center gap-1 rounded-lg p-2 opacity-40">
								<div className="bg-muted flex size-14 items-center justify-center rounded-full">
									<span className="text-muted-foreground text-lg">?</span>
								</div>
								<div className="flex w-full flex-col items-center gap-0.5">
									<span className="text-center text-xs leading-tight font-black uppercase">
										{tCommon('wildCard')}
									</span>
									<span className="text-muted-foreground text-xs">
										{tCommon('tbd')}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<SheetFooter className="border-t pt-3">
					<Button
						className="w-full"
						disabled={!isComplete || isPending}
						onClick={handleSave}
						size="lg"
						variant="success"
					>
						{isPending ? (
							<>
								<Spinner className="size-4" />
								{t('saving')}
							</>
						) : (
							<>
								{t('save')}
								<Save className="size-4" />
							</>
						)}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
