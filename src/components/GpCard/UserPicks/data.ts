import { unstable_cache } from 'next/cache'
import { sql } from 'kysely'

import type { TRider } from '@/components/RiderTile'
import { cacheTags } from '@/lib/cache-tags'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export const getGpRiders = unstable_cache(
	(gpId: number) => _getGpRiders(gpId),
	['gp-riders'],
	{ tags: [cacheTags.gpResults] }
)

/**
 * Returns the riders for a GP.
 * If riders_results exist for the GP, returns those riders (covers historical/finished GPs).
 * Otherwise falls back to the 15 active seeded riders + wild card.
 */
async function _getGpRiders(gpId: number): Promise<TRider[]> {
	const gp = await db
		.selectFrom('gps')
		.select('wild_card_id')
		.where('id', '=', gpId)
		.executeTakeFirst()
	const wildCardId = gp?.wild_card_id
	// Check if riders_results exist for this GP
	const fromResults = await dataFetch(
		() =>
			db
				.selectFrom('riders_results')
				.innerJoin(
					'riders_with_country',
					'riders_with_country.id',
					'riders_results.rider_id'
				)
				.select([
					'riders_with_country.id',
					'riders_with_country.name',
					'riders_with_country.number',
					'riders_with_country.country_code'
				])
				.where('riders_results.gp_id', '=', gpId)
				.execute(),
		[] as {
			id: number | null
			name: string | null
			number: number | null
			country_code: string | null
		}[]
	)

	if (fromResults.length > 0) {
		return fromResults.filter(
			(r): r is TRider => r.id != null && r.name != null && r.number != null
		)
	}

	// Fall back to active seeded riders + wild card
	const activeRaw = await dataFetch(
		() =>
			db
				.selectFrom('riders_with_country')
				.innerJoin('riders', 'riders.id', 'riders_with_country.id')
				.select([
					'riders_with_country.id',
					'riders_with_country.name',
					'riders_with_country.number',
					'riders_with_country.country_code'
				])
				.where('riders.active', 'is not', null)
				.orderBy('riders.active')
				.execute(),
		[] as {
			id: number | null
			name: string | null
			number: number | null
			country_code: string | null
		}[]
	)

	const active: TRider[] = activeRaw.filter(
		(r): r is TRider => r.id != null && r.name != null && r.number != null
	)

	if (!wildCardId) return active

	const wildCardRaw = await dataFetch(
		() =>
			db
				.selectFrom('riders_with_country')
				.select([
					'riders_with_country.id',
					'riders_with_country.name',
					'riders_with_country.number',
					'riders_with_country.country_code'
				])
				.where('riders_with_country.id', '=', wildCardId)
				.executeTakeFirst(),
		null
	)

	if (
		!wildCardRaw ||
		wildCardRaw.id == null ||
		wildCardRaw.name == null ||
		wildCardRaw.number == null
	) {
		return active
	}

	return [
		...active,
		{
			id: wildCardRaw.id,
			name: wildCardRaw.name,
			number: wildCardRaw.number,
			country_code: wildCardRaw.country_code
		}
	]
}

export type TUserPick = {
	id: number
	name: string
	number: number
	country_code: string | null
	medal: number | null
	points: number | null
}

export const getUserPicksWithResults = unstable_cache(
	(gpId: number, userId: number) => _getUserPicksWithResults(gpId, userId),
	['user-picks-with-results'],
	{ tags: [cacheTags.picks, cacheTags.gpResults] }
)

/** Returns a user's 3 picked riders with full details and results. */
async function _getUserPicksWithResults(
	gpId: number,
	userId: number
): Promise<TUserPick[]> {
	const row = await dataFetch(
		() =>
			db
				.selectFrom('users_picks')
				.leftJoin(
					'riders_with_country as r1',
					'r1.id',
					'users_picks.rider_1_id'
				)
				.leftJoin(
					'riders_with_country as r2',
					'r2.id',
					'users_picks.rider_2_id'
				)
				.leftJoin(
					'riders_with_country as r3',
					'r3.id',
					'users_picks.rider_3_id'
				)
				.leftJoin('riders_results as rr1', (join) =>
					join
						.onRef('rr1.rider_id', '=', 'users_picks.rider_1_id')
						.on('rr1.gp_id', '=', gpId)
				)
				.leftJoin('riders_results as rr2', (join) =>
					join
						.onRef('rr2.rider_id', '=', 'users_picks.rider_2_id')
						.on('rr2.gp_id', '=', gpId)
				)
				.leftJoin('riders_results as rr3', (join) =>
					join
						.onRef('rr3.rider_id', '=', 'users_picks.rider_3_id')
						.on('rr3.gp_id', '=', gpId)
				)
				.select([
					'r1.id as pick_1_id',
					'r1.name as pick_1_name',
					'r1.number as pick_1_number',
					'r1.country_code as pick_1_country',
					'r2.id as pick_2_id',
					'r2.name as pick_2_name',
					'r2.number as pick_2_number',
					'r2.country_code as pick_2_country',
					'r3.id as pick_3_id',
					'r3.name as pick_3_name',
					'r3.number as pick_3_number',
					'r3.country_code as pick_3_country'
				])
				.select([
					sql<number | null>`rr1.points`.as('pick_1_points'),
					sql<number | null>`rr1.medal`.as('pick_1_medal'),
					sql<number | null>`rr2.points`.as('pick_2_points'),
					sql<number | null>`rr2.medal`.as('pick_2_medal'),
					sql<number | null>`rr3.points`.as('pick_3_points'),
					sql<number | null>`rr3.medal`.as('pick_3_medal')
				])
				.where('users_picks.gp_id', '=', gpId)
				.where('users_picks.user_id', '=', userId)
				.executeTakeFirst(),
		null
	)

	if (!row) return []

	return [
		{
			id: row.pick_1_id,
			name: row.pick_1_name,
			number: row.pick_1_number,
			country_code: row.pick_1_country,
			medal: row.pick_1_medal ?? null,
			points: row.pick_1_points ?? null
		},
		{
			id: row.pick_2_id,
			name: row.pick_2_name,
			number: row.pick_2_number,
			country_code: row.pick_2_country,
			medal: row.pick_2_medal ?? null,
			points: row.pick_2_points ?? null
		},
		{
			id: row.pick_3_id,
			name: row.pick_3_name,
			number: row.pick_3_number,
			country_code: row.pick_3_country,
			medal: row.pick_3_medal ?? null,
			points: row.pick_3_points ?? null
		}
	].filter(
		(r): r is TUserPick => r.id != null && r.name != null && r.number != null
	)
}

export const getUserPicks = unstable_cache(
	(gpId: number, userId: number) => _getUserPicks(gpId, userId),
	['user-picks'],
	{ tags: [cacheTags.picks] }
)

/** Returns the existing picks for a user/GP pair as a tuple, or null if none. */
async function _getUserPicks(
	gpId: number,
	userId: number
): Promise<[number, number, number] | null> {
	const row = await dataFetch(
		() =>
			db
				.selectFrom('users_picks')
				.select(['rider_1_id', 'rider_2_id', 'rider_3_id'])
				.where('gp_id', '=', gpId)
				.where('user_id', '=', userId)
				.executeTakeFirst(),
		null
	)
	return row ? [row.rider_1_id, row.rider_2_id, row.rider_3_id] : null
}
