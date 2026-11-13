'use server'

import { getTranslations } from 'next-intl/server'
import { updateTag } from 'next/cache'

import { ActivityAction } from '@/components/ActivityFeed'
import { getViewer } from '@/lib/auth/get-viewer'
import { BUDGET_COINS, isTransferWindowOpen, TEAM_SIZE } from '@/lib/budget'
import { cacheTags } from '@/lib/cache-tags'
import { db } from '@/lib/db'
import { withTransaction } from '@/lib/db-transaction'

type TResult = {
	error?: string
	/** The sheet was showing old prices: reload them and let the player decide again */
	pricesChanged?: boolean
}

/**
 * Saves the viewer's 3 riders for a GP. The user always comes from the
 * session, never from the client.
 *
 * 2027+ budget GPs (a priced field in gps_riders): a trade. Kept riders cost
 * what was paid (users_team), bought riders today's price, max 10 coins.
 * Team, picks and the private trade log are written in one transaction, and
 * nothing goes to activity_log. Older GPs: plain picks + activity log.
 */
export async function savePicksAction(
	gpId: number,
	riderIds: [number, number, number],
	/** Price the sheet showed per rider, so a stale sheet never buys at a price it didn't show */
	shownCoins: Record<number, number | null> = {}
): Promise<TResult> {
	const userId = (await getViewer()).db?.id
	if (!userId) return { error: (await getTranslations('Errors'))('title') }

	const gp = await db
		.selectFrom('gps')
		.select('start_date')
		.where('id', '=', gpId)
		.executeTakeFirst()

	if (!gp || new Date(gp.start_date) <= new Date()) {
		return { error: (await getTranslations('PickRiders'))('closed') }
	}

	const field = await db
		.selectFrom('gps_riders')
		.select(['rider_id', 'coins'])
		.where('gp_id', '=', gpId)
		.execute()
	const isBudgetGp = field.length > 0

	if (isBudgetGp && !isTransferWindowOpen(field, gp.start_date)) {
		return { error: (await getTranslations('MyTeam'))('windowClosed') }
	}

	const year = new Date(gp.start_date).getFullYear()
	const tPick = await getTranslations('PickRiders')
	const overBudget = tPick('overBudget', { budget: BUDGET_COINS })
	const pricesChanged = tPick('pricesChanged')

	const genericError = (await getTranslations('Errors'))('title')

	const result = await withTransaction<TResult>(async (trx) => {
		// Prices read under a shared lock: an odds save (which locks the field
		// for update) and this trade can't interleave, one waits for the other
		const fieldNow = isBudgetGp
			? await trx
					.selectFrom('gps_riders')
					.select(['rider_id', 'coins'])
					.where('gp_id', '=', gpId)
					.forShare()
					.execute()
			: []
		const coinsById = new Map(fieldNow.map((r) => [r.rider_id, r.coins]))

		// Read the team inside the transaction so a double submit sees the
		// first one's result (and the unique key stops a second buy)
		const team = isBudgetGp
			? await trx
					.selectFrom('users_team')
					.select(['rider_id', 'coins_paid'])
					.where('user_id', '=', userId)
					.where('year', '=', year)
					.forUpdate()
					.execute()
			: []
		const paidById = new Map(team.map((r) => [r.rider_id, r.coins_paid]))
		const sold = team
			.map((r) => r.rider_id)
			.filter((id) => !riderIds.includes(id))
		const bought = riderIds.filter((id) => !paidById.has(id))

		// Prices re-run (e.g. a replacement) while the sheet was open: a rider
		// being bought is gone or costs something else than the sheet showed
		if (
			isBudgetGp &&
			bought.some(
				(id) => !coinsById.has(id) || coinsById.get(id) !== shownCoins[id]
			)
		) {
			return { error: pricesChanged, pricesChanged: true }
		}

		if (isBudgetGp) {
			const cost = riderIds.map((id) => paidById.get(id) ?? coinsById.get(id))
			const fits =
				new Set(riderIds).size === TEAM_SIZE &&
				cost.every((c) => c != null) &&
				cost.reduce<number>((sum, c) => sum + (c ?? 0), 0) <= BUDGET_COINS

			if (!fits) return { error: overBudget }
		}

		const existing = await trx
			.selectFrom('users_picks')
			.select('id')
			.where('gp_id', '=', gpId)
			.where('user_id', '=', userId)
			.executeTakeFirst()

		await trx
			.insertInto('users_standings')
			.values({ user_id: userId, year })
			.onConflict((oc) => oc.columns(['user_id', 'year']).doNothing())
			.execute()

		await trx
			.insertInto('users_results')
			.values({ user_id: userId, gp_id: gpId })
			.onConflict((oc) => oc.columns(['gp_id', 'user_id']).doNothing())
			.execute()

		const [rider_1_id, rider_2_id, rider_3_id] = riderIds

		await trx
			.insertInto('users_picks')
			.values({
				gp_id: gpId,
				user_id: userId,
				rider_1_id,
				rider_2_id,
				rider_3_id
			})
			.onConflict((oc) =>
				oc.columns(['gp_id', 'user_id']).doUpdateSet({
					rider_1_id,
					rider_2_id,
					rider_3_id,
					updated_at: new Date()
				})
			)
			.execute()

		if (!isBudgetGp) {
			await trx
				.insertInto('activity_log')
				.values({
					user_id: userId,
					gp_id: gpId,
					action: existing
						? ActivityAction.PickUpdated
						: ActivityAction.PickCreated
				})
				.execute()
			return {}
		}

		if (bought.length === 0) return {}

		// Trades are private: never written to activity_log. The team holds the
		// locked price; sold and bought riders are paired up in order.
		if (sold.length > 0) {
			await trx
				.deleteFrom('users_team')
				.where('user_id', '=', userId)
				.where('year', '=', year)
				.where('rider_id', 'in', sold)
				.execute()
		}

		await trx
			.insertInto('users_team')
			.values(
				bought.map((riderId) => ({
					user_id: userId,
					year,
					rider_id: riderId,
					coins_paid: coinsById.get(riderId)!
				}))
			)
			.execute()

		await trx
			.insertInto('users_trades')
			.values(
				bought.map((riderInId, i) => {
					const riderOutId = sold[i] ?? null
					return {
						user_id: userId,
						gp_id: gpId,
						rider_out_id: riderOutId,
						coins_out: riderOutId != null ? paidById.get(riderOutId)! : null,
						rider_in_id: riderInId,
						coins_in: coinsById.get(riderInId)!
					}
				})
			)
			.execute()

		return {}
	}).catch((error: unknown) => {
		// Rolled back, nothing saved (e.g. a racing double submit)
		console.error(error)
		return { error: genericError }
	})

	if (result.error) return result

	if (!isBudgetGp) updateTag(cacheTags.activity)
	updateTag(cacheTags.picks)
	updateTag(cacheTags.standings)

	return {}
}
