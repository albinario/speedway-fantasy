'use server'

import { revalidatePath } from 'next/cache'

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

	await db
		.updateTable('gps')
		.set({
			...(noHeat ? {} : { heats_finished: sql`heats_finished + 1` }),
			...(isFinal ? { finished: true } : {})
		})
		.where('id', '=', gpId)
		.execute()

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
		const slots = [
			{ riderId: pick.rider_1_id, medalField: 'medal_1' as const },
			{ riderId: pick.rider_2_id, medalField: 'medal_2' as const },
			{ riderId: pick.rider_3_id, medalField: 'medal_3' as const }
		]

		let earnedPoints = 0
		let earnedHeats = 0
		const medalUpdates: Partial<
			Record<'medal_1' | 'medal_2' | 'medal_3', number>
		> = {}

		for (const { riderId, medalField } of slots) {
			const pts = pointsByRiderId.get(riderId)
			if (pts !== undefined) {
				earnedPoints += pts
				earnedHeats += 1
				if (isFinal) {
					const medal = medalFromPoints(pts)
					if (medal != null) medalUpdates[medalField] = medal
				}
			}
		}

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

	revalidatePath('/')
	revalidatePath('/gps/[id]', 'page')
	revalidatePath('/standings')

	return {}
}
