'use server'

import { updateTag } from 'next/cache'

import { ActivityAction } from '@/components/ActivityFeed'
import { cacheTags } from '@/lib/cache-tags'
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

	const existing = await db
		.selectFrom('users_picks')
		.select('id')
		.where('gp_id', '=', gpId)
		.where('user_id', '=', userId)
		.executeTakeFirst()

	const year = new Date(gp.start_date).getFullYear()

	await db
		.insertInto('users_standings')
		.values({ user_id: userId, year })
		.onConflict((oc) => oc.columns(['user_id', 'year']).doNothing())
		.execute()

	await db
		.insertInto('users_results')
		.values({ user_id: userId, gp_id: gpId })
		.onConflict((oc) => oc.columns(['gp_id', 'user_id']).doNothing())
		.execute()

	const [rider_1_id, rider_2_id, rider_3_id] = riderIds

	await db
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

	const action = existing
		? ActivityAction.PickUpdated
		: ActivityAction.PickCreated

	await db
		.insertInto('activity_log')
		.values({ user_id: userId, gp_id: gpId, action })
		.execute()

	updateTag(cacheTags.picks)
	updateTag(cacheTags.activity)

	return {}
}
