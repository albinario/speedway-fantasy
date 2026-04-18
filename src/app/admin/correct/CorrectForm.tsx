'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { correctResultAction } from './actions'
import type { getThisYearGps, getThisYearRiders } from './data'

type TGp = Awaited<ReturnType<typeof getThisYearGps>>[number]
type TRider = Awaited<ReturnType<typeof getThisYearRiders>>[number]
type TMedalState = boolean | null // null=untouched, true=add, false=remove

const MEDAL_TYPES = [
	{ key: 'gold' as const, label: 'Gold', accent: 'accent-yellow-400' },
	{ key: 'silver' as const, label: 'Silver', accent: 'accent-gray-300' },
	{ key: 'bronze' as const, label: 'Bronze', accent: 'accent-orange-400' }
]

function MedalCheckbox({
	label,
	accent,
	value,
	onChange
}: {
	label: string
	accent: string
	value: TMedalState
	onChange: (v: TMedalState) => void
}) {
	const ref = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (ref.current) ref.current.indeterminate = value === null
	}, [value])

	return (
		<label className="flex cursor-pointer items-center gap-3">
			<input
				ref={ref}
				type="checkbox"
				checked={value === true}
				onChange={(e) => onChange(e.target.checked ? true : false)}
				className={`size-5 cursor-pointer ${accent}`}
			/>
			<span className="text-sm font-semibold">
				{label}
				{value === true && (
					<span className="text-muted-foreground ml-2 font-normal">add</span>
				)}
				{value === false && (
					<span className="text-muted-foreground ml-2 font-normal">remove</span>
				)}
			</span>
		</label>
	)
}

type TCorrectForm = {
	gps: TGp[]
	riders: TRider[]
}

export function CorrectForm({ gps, riders }: TCorrectForm) {
	const [gpId, setGpId] = useState(gps[0] ? String(gps[0].id) : '')
	const [riderId, setRiderId] = useState('')
	const [points, setPoints] = useState('')
	const [heats, setHeats] = useState('')
	const [medals, setMedals] = useState<
		Record<'gold' | 'silver' | 'bronze', TMedalState>
	>({
		gold: null,
		silver: null,
		bronze: null
	})
	const [isPending, startTransition] = useTransition()

	const anyMedalSet = Object.values(medals).some((v) => v !== null)
	const disabled =
		!gpId || !riderId || (!points && !heats && !anyMedalSet) || isPending

	function setMedal(key: 'gold' | 'silver' | 'bronze', value: TMedalState) {
		setMedals((prev) => ({ ...prev, [key]: value }))
	}

	function toAction(v: TMedalState): 'add' | 'remove' | null {
		return v === true ? 'add' : v === false ? 'remove' : null
	}

	function handleSubmit() {
		if (disabled) return

		startTransition(async () => {
			const res = await correctResultAction(
				Number(gpId),
				Number(riderId),
				points ? Number(points) : 0,
				heats ? Number(heats) : 0,
				{
					gold: toAction(medals.gold),
					silver: toAction(medals.silver),
					bronze: toAction(medals.bronze)
				}
			)

			if (res.error) {
				toast.error(res.error)
				return
			}

			toast.success('Correction applied')
			setPoints('')
			setHeats('')
			setMedals({ gold: null, silver: null, bronze: null })
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Correct result</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-4">
				<div className="grid gap-2">
					<Label>GP</Label>
					<Select value={gpId} onValueChange={setGpId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a GP" />
						</SelectTrigger>
						<SelectContent>
							{gps.map((gp) => (
								<SelectItem key={gp.id} value={String(gp.id)}>
									R{gp.round}. {gp.city_name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="grid gap-2">
					<Label>Rider</Label>
					<Select value={riderId} onValueChange={setRiderId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a rider" />
						</SelectTrigger>
						<SelectContent>
							{riders.map((r) =>
								r.id != null ? (
									<SelectItem key={r.id} value={String(r.id)}>
										{r.name}
									</SelectItem>
								) : null
							)}
						</SelectContent>
					</Select>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="grid gap-2">
						<Label htmlFor="points">Points</Label>
						<Input
							id="points"
							type="number"
							value={points}
							onChange={(e) => setPoints(e.target.value)}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="heats">Heats</Label>
						<Input
							id="heats"
							type="number"
							value={heats}
							onChange={(e) => setHeats(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex justify-evenly gap-2">
					{MEDAL_TYPES.map(({ key, label, accent }) => (
						<MedalCheckbox
							key={key}
							label={label}
							accent={accent}
							value={medals[key]}
							onChange={(v) => setMedal(key, v)}
						/>
					))}
				</div>
			</CardContent>

			<CardFooter>
				<Button className="w-full" disabled={disabled} onClick={handleSubmit}>
					{isPending ? (
						<>
							<Spinner className="size-4" /> Applying…
						</>
					) : (
						'Apply correction'
					)}
				</Button>
			</CardFooter>
		</Card>
	)
}
