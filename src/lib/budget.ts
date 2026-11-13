/** 2027 budget system: every team has 3 riders costing at most 10 coins in total. */
export const BUDGET_COINS = 10
export const TEAM_SIZE = 3
export const FIELD_SIZE = 16

type TPriced = { id: number; coins: number | null }

/**
 * The transfer window is derived, never stored: open when the GP has prices
 * for all 16 riders and hasn't started yet.
 */
export function isTransferWindowOpen(
	field: { coins: number | null }[],
	startDate: Date | string | null | undefined
): boolean {
	return (
		field.length === FIELD_SIZE &&
		field.every((r) => r.coins != null) &&
		startDate != null &&
		new Date(startDate) > new Date()
	)
}

/**
 * Whether a rider can be added to a selection without breaking the budget.
 * Also keeps room for the riders still to pick at the cheapest price, so a
 * selection can always be completed (e.g. 5 + 5 is blocked: no coin left for the third).
 */
export function canAfford(
	rider: TPriced,
	selected: TPriced[],
	field: TPriced[]
): boolean {
	if (rider.coins == null || selected.length >= TEAM_SIZE) return false

	const spent = selected.reduce((sum, r) => sum + (r.coins ?? 0), 0)
	const takenIds = new Set([...selected.map((r) => r.id), rider.id])
	const leftToPick = TEAM_SIZE - selected.length - 1
	const cheapest = field
		.filter((r) => r.coins != null && !takenIds.has(r.id))
		.map((r) => r.coins as number)
		.sort((a, b) => a - b)
		.slice(0, leftToPick)
		.reduce((sum, c) => sum + c, 0)

	return spent + rider.coins + cheapest <= BUDGET_COINS
}

/** Coins per rider, from biggest favourite (lowest odds) to longest shot. */
export const TIER_COINS = [5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1] as const

/**
 * Coins for a GP's field. Lowest odds = most expensive. Equal odds are broken
 * by tieRank (lower = better): SGP standings, or active order before GP1.
 */
export function priceField(
	rows: { riderId: number; odds: number; tieRank: number }[]
): Map<number, number> {
	const sorted = [...rows].sort(
		(a, b) => a.odds - b.odds || a.tieRank - b.tieRank
	)
	return new Map(
		sorted.map((r, i) => [r.riderId, TIER_COINS[i] ?? 1] as [number, number])
	)
}

/** Decimal odds typed with a comma or a dot ("1,90" / "1.90"). null if invalid. */
export function parseOdds(input: string): number | null {
	const value = Number(input.trim().replace(',', '.'))
	if (!input.trim() || !Number.isFinite(value) || value <= 0 || value >= 1e6) {
		return null
	}
	return Math.round(value * 100) / 100
}
