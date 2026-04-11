import type { TPickRider } from '@/components/PickRiders'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

/**
 * Returns the riders for a GP.
 * If riders_results exist for the GP, returns those riders (covers historical/finished GPs).
 * Otherwise falls back to the 15 active seeded riders + wild card.
 */
export async function getGpRiders(
	gpId: number,
	wildCardId: number | null | undefined
): Promise<TPickRider[]> {
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
			(r): r is TPickRider => r.id != null && r.name != null && r.number != null
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

	const active: TPickRider[] = activeRaw.filter(
		(r): r is TPickRider => r.id != null && r.name != null && r.number != null
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

/** Returns the viewer's result row for a GP, including picks and position. */
export function getViewerGpRow(gpId: number, viewerId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_results')
				.innerJoin(
					'users_with_stars',
					'users_with_stars.id',
					'users_results.user_id'
				)
				.leftJoin('users_picks', (join) =>
					join
						.onRef('users_picks.user_id', '=', 'users_results.user_id')
						.onRef('users_picks.gp_id', '=', 'users_results.gp_id')
				)
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
				.select([
					'users_results.user_id',
					'users_results.pos',
					'users_with_stars.first_name',
					'users_with_stars.last_name',
					'users_with_stars.stars',
					'users_results.points',
					'users_results.heats',
					'users_results.medal_1',
					'users_results.medal_2',
					'users_results.medal_3',
					'r1.country_code as pick_1_country',
					'r1.number as pick_1_number',
					'r2.country_code as pick_2_country',
					'r2.number as pick_2_number',
					'r3.country_code as pick_3_country',
					'r3.number as pick_3_number'
				])
				.where('users_results.gp_id', '=', gpId)
				.where('users_results.user_id', '=', viewerId)
				.executeTakeFirst(),
		null
	)
}

/** Returns the existing picks row for a viewer/GP pair, or null if none. */
export function getViewerPicks(gpId: number, userId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_picks')
				.select(['rider_1_id', 'rider_2_id', 'rider_3_id'])
				.where('gp_id', '=', gpId)
				.where('user_id', '=', userId)
				.executeTakeFirst(),
		null
	)
}
