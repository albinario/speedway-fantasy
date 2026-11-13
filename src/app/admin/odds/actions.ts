'use server'

import { updateTag } from 'next/cache'

import { sql } from 'kysely'

import { adminOnly } from '@/lib/auth/admin-only'
import { FIELD_SIZE, priceField } from '@/lib/budget'
import { cacheTags } from '@/lib/cache-tags'
import { db } from '@/lib/db'
import { withTransaction } from '@/lib/db-transaction'
import { notifyReplacedRiderOwners } from '@/lib/replacement-emails'

import { getNextOddsGpId, getTieRanks } from './data'

type TSaveOdds = {
	gpId: number
	/** 16 riders; the wildcard is one of them */
	riders: { riderId: number; odds: number }[]
	wildCardId: number
}

type TSaveOddsResult = { error?: string; copiedTeams?: number }

/**
 * Saves a GP's field with odds and coins. Opens the transfer window once all
 * 16 are priced. The first save also copies each player's last team (this
 * season) to the GP, only where they have no row yet, so later odds fixes
 * never overwrite trades.
 */
export async function saveOddsAction({
	gpId,
	riders,
	wildCardId
}: TSaveOdds): Promise<TSaveOddsResult> {
	const denied = await adminOnly()
	if (denied) return denied

	const ids = riders.map((r) => r.riderId)
	if (riders.length !== FIELD_SIZE || new Set(ids).size !== FIELD_SIZE) {
		return { error: `The field must have ${FIELD_SIZE} different riders.` }
	}
	if (!ids.includes(wildCardId)) {
		return { error: 'The wildcard must be in the field.' }
	}
	if (riders.some((r) => !Number.isFinite(r.odds) || r.odds <= 0)) {
		return { error: 'Every rider needs odds above 0.' }
	}

	if ((await getNextOddsGpId()) !== gpId) {
		return { error: 'Odds can only be set for the next upcoming GP.' }
	}

	const gp = await db
		.selectFrom('gps')
		.select(['start_date', 'finished', 'wild_card_id'])
		.where('id', '=', gpId)
		.executeTakeFirst()

	if (!gp) return { error: 'GP not found.' }
	if (gp.finished) return { error: 'This GP is already finished.' }

	const tieRanks = await getTieRanks(gpId)
	const coinsById = priceField(
		riders.map((r) => ({
			riderId: r.riderId,
			odds: r.odds,
			tieRank: tieRanks.get(r.riderId) ?? Number.MAX_SAFE_INTEGER
		}))
	)

	const year = new Date(gp.start_date).getFullYear()

	// All writes in one transaction: the field, the wildcard and the copied
	// teams land together or not at all
	const saved = await withTransaction(async (trx) => {
		const existing = await trx
			.selectFrom('gps_riders')
			.select('rider_id')
			.where('gp_id', '=', gpId)
			.forUpdate()
			.execute()
		const isFirstSave = existing.length === 0

		// Riders taken out of the field (replacements) lose their row
		await trx
			.deleteFrom('gps_riders')
			.where('gp_id', '=', gpId)
			.where('rider_id', 'not in', ids)
			.execute()

		await trx
			.insertInto('gps_riders')
			.values(
				riders.map((r) => ({
					gp_id: gpId,
					rider_id: r.riderId,
					odds: String(r.odds),
					coins: coinsById.get(r.riderId)!
				}))
			)
			.onConflict((oc) =>
				oc.columns(['gp_id', 'rider_id']).doUpdateSet((eb) => ({
					odds: eb.ref('excluded.odds'),
					coins: eb.ref('excluded.coins'),
					updated_at: new Date()
				}))
			)
			.execute()

		if (gp.wild_card_id !== wildCardId) {
			await trx
				.updateTable('gps')
				.set({ wild_card_id: wildCardId })
				.where('id', '=', gpId)
				.execute()
		}

		let copiedUserIds: number[] = []

		if (isFirstSave) {
			// Each player's latest team from an earlier GP this season
			const copied = await sql<{ user_id: number }>`
				INSERT INTO users_picks (gp_id, user_id, rider_1_id, rider_2_id, rider_3_id)
				SELECT ${gpId}, latest.user_id, latest.rider_1_id, latest.rider_2_id, latest.rider_3_id
				FROM (
					SELECT DISTINCT ON (up.user_id)
						up.user_id, up.rider_1_id, up.rider_2_id, up.rider_3_id
					FROM users_picks up
					INNER JOIN gps g ON g.id = up.gp_id
					WHERE EXTRACT(YEAR FROM g.start_date) = ${year}
					  AND g.start_date < ${gp.start_date}
					ORDER BY up.user_id, g.start_date DESC
				) latest
				ON CONFLICT (gp_id, user_id) DO NOTHING
				RETURNING user_id
			`.execute(trx)

			copiedUserIds = copied.rows.map((r) => r.user_id)

			if (copiedUserIds.length > 0) {
				await trx
					.insertInto('users_results')
					.values(copiedUserIds.map((user_id) => ({ user_id, gp_id: gpId })))
					.onConflict((oc) => oc.columns(['gp_id', 'user_id']).doNothing())
					.execute()

				await trx
					.insertInto('users_standings')
					.values(copiedUserIds.map((user_id) => ({ user_id, year })))
					.onConflict((oc) => oc.columns(['user_id', 'year']).doNothing())
					.execute()
			}
		}

		return {
			isFirstSave,
			before: new Set(existing.map((r) => r.rider_id)),
			copiedTeams: copiedUserIds.length
		}
	}).catch((error: unknown) => {
		console.error(error)
		return null
	})

	if (!saved) return { error: 'Saving failed, nothing was changed.' }

	if (gp.wild_card_id !== wildCardId) updateTag(cacheTags.gps)
	if (saved.copiedTeams > 0) {
		updateTag(cacheTags.picks)
		updateTag(cacheTags.standings)
	}

	// A replacement: email every owner of a rider taken out (and the admin),
	// only after the field is committed
	if (!saved.isFirstSave) {
		await notifyReplacedRiderOwners({
			gpId,
			removedRiderIds: [...saved.before].filter((id) => !ids.includes(id)),
			addedRiderIds: ids.filter((id) => !saved.before.has(id))
		})
	}

	updateTag(cacheTags.gpField)

	return { copiedTeams: saved.copiedTeams }
}
