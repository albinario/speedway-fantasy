'use server'

import { revalidatePath } from 'next/cache'

import { sql } from 'kysely'

import { db } from '@/lib/db'

const RANK_ORDER = sql`ORDER BY points DESC, medal_1 DESC, medal_2 DESC, medal_3 DESC, heats DESC`

type TMedalAction = 'add' | 'remove' | null

export async function correctResultAction(
	gpId: number,
	riderId: number,
	pointsDelta: number,
	heatsDelta: number,
	medals: { gold: TMedalAction; silver: TMedalAction; bronze: TMedalAction }
): Promise<{ error?: string }> {
	const gp = await db
		.selectFrom('gps')
		.select('start_date')
		.where('id', '=', gpId)
		.executeTakeFirst()

	if (!gp) return { error: 'GP not found' }

	const year = new Date(gp.start_date).getFullYear()

	const medalTypeMap = { gold: 1, silver: 2, bronze: 3 } as const
	const delta = (a: TMedalAction) => (a === 'add' ? 1 : a === 'remove' ? -1 : 0)

	const userMedalUpdates = Object.fromEntries(
		(Object.entries(medals) as [keyof typeof medals, TMedalAction][])
			.filter(([, a]) => a !== null)
			.map(([key, a]) => [
				`medal_${medalTypeMap[key]}`,
				sql`medal_${sql.raw(String(medalTypeMap[key]))} + ${delta(a)}`
			])
	)

	// riders_results stores the medal type directly (only gold applies here)
	const riderMedalUpdate =
		medals.gold === 'add'
			? { medal: 1 }
			: medals.gold === 'remove'
				? { medal: null }
				: {}

	await db
		.updateTable('riders_results')
		.set({
			points: sql`points + ${pointsDelta}`,
			heats: sql`heats + ${heatsDelta}`,
			...riderMedalUpdate
		})
		.where('gp_id', '=', gpId)
		.where('rider_id', '=', riderId)
		.execute()

	const anyChange =
		pointsDelta !== 0 ||
		heatsDelta !== 0 ||
		Object.keys(userMedalUpdates).length > 0

	if (anyChange) {
		const picks = await db
			.selectFrom('users_picks')
			.select(['user_id', 'rider_1_id', 'rider_2_id', 'rider_3_id'])
			.where('gp_id', '=', gpId)
			.execute()

		for (const pick of picks) {
			if (
				![pick.rider_1_id, pick.rider_2_id, pick.rider_3_id].includes(riderId)
			)
				continue

			await db
				.updateTable('users_results')
				.set({
					points: sql`points + ${pointsDelta}`,
					heats: sql`heats + ${heatsDelta}`,
					...userMedalUpdates
				})
				.where('gp_id', '=', gpId)
				.where('user_id', '=', pick.user_id)
				.execute()

			await db
				.updateTable('users_standings')
				.set({
					points: sql`points + ${pointsDelta}`,
					heats: sql`heats + ${heatsDelta}`,
					...userMedalUpdates
				})
				.where('user_id', '=', pick.user_id)
				.where('year', '=', year)
				.execute()
		}
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
