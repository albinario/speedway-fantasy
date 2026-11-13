import { getUserPicksWithResults } from '@/components/GpCard/UserPicks/data'
import { getGpField, type TFieldRider } from '@/components/PickRidersSheet/data'
import { isTransferWindowOpen } from '@/lib/budget'
import { getTeam } from '@/lib/team'

/**
 * Everything the My team card and the trade sheet need for the next GP.
 * Team riders cost what was paid for them (locked price), even when they
 * are no longer in the field; those are flagged isOut.
 */
export async function getTradeData(
	gpId: number,
	gpStartDate: Date | string,
	userId: number
) {
	const year = new Date(gpStartDate).getFullYear()
	const [field, picks, team] = await Promise.all([
		getGpField(gpId),
		getUserPicksWithResults(gpId, userId),
		getTeam(userId, year)
	])

	const paidById = new Map(team.map((r) => [r.rider_id, r.coins_paid]))
	const fieldCoins = new Map(field.map((r) => [r.id, r.coins]))

	const teamRiders: TFieldRider[] = picks.map((p) => ({
		id: p.id,
		name: p.name,
		number: p.number,
		country_code: p.country_code,
		coins: paidById.get(p.id) ?? fieldCoins.get(p.id) ?? null,
		isOut: field.length > 0 && !fieldCoins.has(p.id)
	}))

	// The sheet: the field at today's prices, own riders at the price paid,
	// plus own riders who are out so they can be sold (or kept)
	const riders: TFieldRider[] = [
		...field.map((r) =>
			paidById.has(r.id) ? { ...r, coins: paidById.get(r.id)! } : r
		),
		...teamRiders.filter((r) => r.isOut)
	]

	return {
		field,
		riders,
		teamRiders,
		spent: teamRiders.reduce((sum, r) => sum + (r.coins ?? 0), 0),
		initialPicks:
			picks.length === 3
				? ([picks[0].id, picks[1].id, picks[2].id] as [number, number, number])
				: null,
		isWindowOpen: isTransferWindowOpen(field, gpStartDate)
	}
}
