'use server'

import { db } from '@/lib/db'

export async function savePicksAction(
	gpId: number,
	userId: number,
	riderIds: [number, number, number]
): Promise<{ error?: string }> {
	const gp = await db
		.selectFrom('gps')
		.select('start_date')
		.where('id', '=', gpId)
		.executeTakeFirst()

	if (!gp || (gp.start_date && new Date(gp.start_date) <= new Date())) {
		return { error: 'Picks are closed for this event.' }
	}

	const [rider_1_id, rider_2_id, rider_3_id] = riderIds

	await db
		.insertInto('users_picks')
		.values({ gp_id: gpId, user_id: userId, rider_1_id, rider_2_id, rider_3_id })
		.onConflict((oc) =>
			oc.columns(['gp_id', 'user_id']).doUpdateSet({
				rider_1_id,
				rider_2_id,
				rider_3_id,
				updated_at: new Date()
			})
		)
		.execute()

	return {}
}
