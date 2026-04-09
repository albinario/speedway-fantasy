import type { TPickRider } from '@/components/PickRiders'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export type { TPickRider as TGpRider }

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
				.innerJoin('riders_with_country', 'riders_with_country.id', 'riders_results.rider_id')
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

	if (!wildCardRaw || wildCardRaw.id == null || wildCardRaw.name == null || wildCardRaw.number == null) {
		return active
	}

	return [...active, { id: wildCardRaw.id, name: wildCardRaw.name, number: wildCardRaw.number, country_code: wildCardRaw.country_code }]
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

