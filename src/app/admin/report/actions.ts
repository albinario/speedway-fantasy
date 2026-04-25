'use server'

import { updateTag } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'

import { sql } from 'kysely'

import { getActiveRidersForGp } from '@/app/riders/data'
import { db } from '@/lib/db'

type HeatRiderResult = {
	riderId: number
	points: number
}

function medalFromPoints(points: number): number | null {
	if (points === 3) return 1
	if (points === 2) return 2
	if (points === 1) return 3
	return null
}

const RANK_ORDER = sql`ORDER BY points DESC, medal_1 DESC, medal_2 DESC, medal_3 DESC, heats DESC`

export async function reportHeatAction(
	gpId: number,
	results: HeatRiderResult[],
	isFinal: boolean,
	noHeat: boolean
): Promise<{ error?: string }> {
	const pointsByRiderId = new Map(results.map((r) => [r.riderId, r.points]))

	const gp = await db
		.selectFrom('gps')
		.select(['start_date', 'heats_finished', 'finished'])
		.where('id', '=', gpId)
		.executeTakeFirst()

	if (!gp) return { error: 'GP not found' }
	if (gp.finished) return { error: 'This GP is already finished.' }

	const year = new Date(gp.start_date).getFullYear()

	if ((gp.heats_finished ?? 0) === 0) {
		const riders = await getActiveRidersForGp(gpId)
		await db
			.insertInto('riders_results')
			.values(riders.map((r) => ({ gp_id: gpId, rider_id: r.id })))
			.onConflict((oc) => oc.columns(['gp_id', 'rider_id']).doNothing())
			.execute()
	}

	if (!noHeat || isFinal) {
		await db
			.updateTable('gps')
			.set({
				...(noHeat ? {} : { heats_finished: sql`heats_finished + 1` }),
				...(isFinal ? { finished: true } : {})
			})
			.where('id', '=', gpId)
			.execute()
	}

	for (const { riderId, points } of results) {
		const medal = isFinal ? medalFromPoints(points) : undefined

		await db
			.insertInto('riders_results')
			.values({
				gp_id: gpId,
				rider_id: riderId,
				points,
				heats: 1,
				...(medal != null ? { medal } : {})
			})
			.onConflict((oc) =>
				oc.columns(['gp_id', 'rider_id']).doUpdateSet((eb) => ({
					points: sql`riders_results.points + ${eb.val(points)}`,
					heats: sql`riders_results.heats + 1`,
					...(isFinal ? { medal } : {})
				}))
			)
			.execute()
	}

	const picks = await db
		.selectFrom('users_picks')
		.select(['user_id', 'rider_1_id', 'rider_2_id', 'rider_3_id'])
		.where('gp_id', '=', gpId)
		.execute()

	for (const pick of picks) {
		const riderIds = [pick.rider_1_id, pick.rider_2_id, pick.rider_3_id]

		let earnedPoints = 0
		let earnedHeats = 0
		const medalCounts = { medal_1: 0, medal_2: 0, medal_3: 0 }

		for (const riderId of riderIds) {
			const pts = pointsByRiderId.get(riderId)
			if (pts !== undefined) {
				earnedPoints += pts
				earnedHeats += 1
				if (isFinal) {
					const medal = medalFromPoints(pts)
					if (medal === 1) medalCounts.medal_1++
					else if (medal === 2) medalCounts.medal_2++
					else if (medal === 3) medalCounts.medal_3++
				}
			}
		}

		const medalUpdates = isFinal
			? Object.fromEntries(
					Object.entries(medalCounts).filter(([, v]) => v > 0)
				) as Partial<Record<'medal_1' | 'medal_2' | 'medal_3', number>>
			: {}

		if (earnedHeats === 0) continue

		await db
			.insertInto('users_results')
			.values({
				gp_id: gpId,
				user_id: pick.user_id,
				points: earnedPoints,
				heats: earnedHeats,
				...medalUpdates
			})
			.onConflict((oc) =>
				oc.columns(['gp_id', 'user_id']).doUpdateSet((eb) => ({
					points: sql`users_results.points + ${eb.val(earnedPoints)}`,
					heats: sql`users_results.heats + ${eb.val(earnedHeats)}`,
					...medalUpdates
				}))
			)
			.execute()

		await db
			.insertInto('users_standings')
			.values({
				user_id: pick.user_id,
				year,
				points: earnedPoints,
				heats: earnedHeats,
				...medalUpdates
			})
			.onConflict((oc) =>
				oc.columns(['user_id', 'year']).doUpdateSet((eb) => ({
					points: sql`users_standings.points + ${eb.val(earnedPoints)}`,
					heats: sql`users_standings.heats + ${eb.val(earnedHeats)}`,
					...medalUpdates
				}))
			)
			.execute()
	}

	await sql`
		UPDATE riders_results
		SET pos = ranking.pos
		FROM (
			SELECT id, RANK() OVER (ORDER BY points DESC) AS pos
			FROM riders_results
			WHERE gp_id = ${gpId}
		) AS ranking
		WHERE riders_results.id = ranking.id
	`.execute(db)

	await sql`
		UPDATE users_results
		SET pos = ranking.pos
		FROM (
			SELECT id, RANK() OVER (${RANK_ORDER}) AS pos
			FROM users_results
			WHERE gp_id = ${gpId}
		) AS ranking
		WHERE users_results.id = ranking.id
	`.execute(db)

	await sql`
		UPDATE users_standings
		SET pos = ranking.pos
		FROM (
			SELECT id, RANK() OVER (${RANK_ORDER}) AS pos
			FROM users_standings
			WHERE year = ${year}
		) AS ranking
		WHERE users_standings.id = ranking.id
	`.execute(db)

	updateTag(cacheTags.gps)
	updateTag(cacheTags.gpResults)
	updateTag(cacheTags.standings)
	updateTag(cacheTags.ridersStandings)
	updateTag(cacheTags.activity)

	return {}
}
