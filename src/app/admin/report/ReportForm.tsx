'use client'

import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { HeatsFinished } from '@/components/HeatsFinished'
import { RiderTile, type TRider } from '@/components/RiderTile'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { reportHeatAction } from './actions'

const POINTS_BY_ORDER = [3, 2, 1, 0]

type TReportFormProps = {
	gpId: number
	cityName: string
	heatsFinished: number
	riders: TRider[]
}

export function ReportForm({
	gpId,
	cityName,
	heatsFinished: initialHeatsFinished,
	riders
}: TReportFormProps) {
	const [isFinal, setIsFinal] = useState(false)
	const [noHeat, setNoHeat] = useState(false)
	const [selected, setSelected] = useState<number[]>([])
	const [heatsFinished, setHeatsFinished] = useState(initialHeatsFinished)
	const [isPending, startTransition] = useTransition()

	const isComplete = selected.length === 4

	function handleTileClick(riderId: number) {
		setSelected((prev) => {
			const idx = prev.indexOf(riderId)
			if (idx !== -1) return prev.filter((id) => id !== riderId)
			if (prev.length >= 4) return prev
			return [...prev, riderId]
		})
	}

	function handleSubmit() {
		const results = selected.map((riderId, i) => ({
			riderId,
			points: POINTS_BY_ORDER[i]
		}))

		startTransition(async () => {
			const res = await reportHeatAction(gpId, results, isFinal, noHeat)

			if (res.error) {
				toast.error(res.error)
				return
			}

			toast.success(isFinal ? 'Final reported!' : 'Heat reported!')
			setSelected([])
			setIsFinal(false)
			setNoHeat(false)
			if (!noHeat) setHeatsFinished((n) => n + 1)
		})
	}

	return (
		<div className="mx-auto flex max-w-sm flex-col gap-6 p-3">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-black uppercase">{cityName}</h1>

				<div className="flex items-center gap-4">
					<label className="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							checked={isFinal}
							onChange={(e) => setIsFinal(e.target.checked)}
							className="size-5 cursor-pointer accent-yellow-400"
						/>
						<span className="text-sm font-semibold">Final</span>
					</label>

					<label className="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							checked={noHeat}
							onChange={(e) => setNoHeat(e.target.checked)}
							className="size-5 cursor-pointer accent-yellow-400"
						/>
						<span className="text-sm font-semibold">No heat</span>
					</label>
				</div>
			</div>

			<HeatsFinished heatsFinished={heatsFinished} />

			<div className="grid grid-cols-4 gap-2">
				{riders.map((rider) => {
					const selectionIdx = selected.indexOf(rider.id)
					const isSelected = selectionIdx !== -1
					const points = isSelected ? POINTS_BY_ORDER[selectionIdx] : undefined

					return (
						<div key={rider.id} className="relative">
							<RiderTile
								rider={rider}
								hideFirstName
								isSelected={isSelected}
								isDimmed={isComplete && !isSelected}
								onClick={() => handleTileClick(rider.id)}
							/>
							{isSelected && (
								<div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-black">
									{points}
								</div>
							)}
						</div>
					)
				})}
			</div>

			<Button
				size="lg"
				className="w-full"
				disabled={selected.length <= 0 || isPending}
				onClick={handleSubmit}
			>
				{isPending ? (
					<>
						<Spinner className="size-4" />
						Saving…
					</>
				) : isFinal ? (
					'Report Final'
				) : (
					'Report Heat'
				)}
			</Button>
		</div>
	)
}
