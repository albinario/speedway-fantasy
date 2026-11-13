'use client'

import { useMemo, useRef, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { Coins, Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { FIELD_SIZE, parseOdds, priceField } from '@/lib/budget'
import { cn } from '@/lib/utils'

import { saveOddsAction } from './actions'
import type { TOddsFormData, TSelectableRider } from './data'

type TOddsForm = {
	data: TOddsFormData
	riders: TSelectableRider[]
}

const WILD_CARD_SLOT = FIELD_SIZE - 1

export function OddsForm({ data, riders }: TOddsForm) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	// 16 slots: 0–14 permanent riders, 15 the wildcard. 0 = empty.
	const [slots, setSlots] = useState<number[]>(() => {
		const initial = Array.from({ length: FIELD_SIZE }, (_, i) =>
			i < WILD_CARD_SLOT ? (data.permanentIds[i] ?? 0) : (data.wildCardId ?? 0)
		)
		return initial
	})
	const [odds, setOdds] = useState<string[]>(() =>
		slots.map((id) => data.oddsById[id] ?? '')
	)

	const parsed = odds.map(parseOdds)
	const counts = slots.reduce(
		(map, id) => map.set(id, (map.get(id) ?? 0) + 1),
		new Map<number, number>()
	)
	const isDuplicate = (id: number) => id !== 0 && (counts.get(id) ?? 0) > 1

	const isComplete =
		slots.every((id) => id !== 0) &&
		counts.size === FIELD_SIZE &&
		parsed.every((o) => o != null)

	const coinsById = useMemo(
		() =>
			isComplete
				? priceField(
						slots.map((riderId, i) => ({
							riderId,
							odds: parsed[i]!,
							tieRank: data.tieRanks[riderId] ?? Number.MAX_SAFE_INTEGER
						}))
					)
				: null,
		// parsed is derived from odds
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isComplete, slots, odds, data.tieRanks]
	)

	function setSlot(index: number, riderId: number) {
		setSlots((prev) => prev.map((id, i) => (i === index ? riderId : id)))
	}

	function setSlotOdds(index: number, value: string) {
		setOdds((prev) => prev.map((o, i) => (i === index ? value : o)))
	}

	// Blocks a second click before isPending has re-rendered the button
	const isSaving = useRef(false)

	function handleSave() {
		if (!isComplete || isSaving.current) return
		isSaving.current = true

		startTransition(async () => {
			try {
				const result = await saveOddsAction({
					gpId: data.gp.id,
					riders: slots.map((riderId, i) => ({ riderId, odds: parsed[i]! })),
					wildCardId: slots[WILD_CARD_SLOT]
				})

				if (result.error) {
					toast.error(result.error)
					return
				}

				toast.success(
					result.copiedTeams
						? `Odds saved. ${result.copiedTeams} teams copied to this GP.`
						: 'Odds saved.'
				)
				router.refresh()
			} finally {
				isSaving.current = false
			}
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Odds · Round {data.gp.round} {data.gp.city_name}
				</CardTitle>
				<CardDescription>
					Decimal odds, comma or dot (1,90 or 1.90). Lowest odds = 5 coins.
					Equal odds are split by SGP standings, or active order before GP1.
					{data.isFirstSave &&
						' The first save also copies every player’s last team to this GP.'}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-2">
				{slots.map((riderId, i) => {
					const isWildCard = i === WILD_CARD_SLOT
					const coins = coinsById?.get(riderId)
					const hasBadOdds = odds[i] !== '' && parsed[i] == null

					return (
						<div
							key={i}
							className={cn(
								'grid grid-cols-[2.5rem_1fr_5.5rem_3rem] items-center gap-2',
								isWildCard && 'mt-2 border-t pt-4'
							)}
						>
							<span className="text-muted-foreground text-xs font-bold">
								{isWildCard ? 'WC' : `#${i + 1}`}
							</span>

							<Select
								value={riderId ? String(riderId) : ''}
								onValueChange={(v) => setSlot(i, Number(v))}
							>
								<SelectTrigger
									aria-label={isWildCard ? 'Wildcard' : `Rider ${i + 1}`}
									aria-invalid={isDuplicate(riderId)}
									className="w-full min-w-0"
								>
									<SelectValue placeholder="Pick a rider" />
								</SelectTrigger>

								<SelectContent>
									{riders.map((r) => (
										<SelectItem key={r.id} value={String(r.id)}>
											{r.name}
											<span className="text-muted-foreground">#{r.number}</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Input
								aria-invalid={hasBadOdds}
								aria-label="Odds"
								inputMode="decimal"
								onChange={(e) => setSlotOdds(i, e.target.value)}
								placeholder="1,90"
								value={odds[i]}
							/>

							<span className="flex items-center justify-end gap-0.5 text-sm font-black text-yellow-400">
								{coins != null && (
									<>
										<Coins className="size-3.5" />
										{coins}
									</>
								)}
							</span>
						</div>
					)
				})}

				{counts.size < FIELD_SIZE && slots.every((id) => id !== 0) && (
					<p className="text-destructive text-sm">
						The same rider is in the field twice.
					</p>
				)}
			</CardContent>

			<CardFooter>
				<Button
					className="w-full"
					disabled={!isComplete || isPending}
					onClick={handleSave}
					size="lg"
					variant="success"
				>
					{isPending ? (
						<Spinner className="size-4" />
					) : (
						<Save className="size-4" />
					)}
					Save odds
				</Button>
			</CardFooter>
		</Card>
	)
}
