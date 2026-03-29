import type { TPickRider } from '@/components/PickRiders'
import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export type { TPickRider as TGpRider }

/**
 * Returns the 16 riders for a GP: 15 active seeded riders (ordered by
 * `active`) plus the designated wild card rider appended at the end.
 */
export async function getGpRiders(
	wildCardId: number | null | undefined
): Promise<TPickRider[]> {
	// Fetch active (seeded) riders — riders_with_country is a view so columns
	// are nullable; filter out any rows with incomplete data.
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

	const active: TPickRider[] = activeRaw
		.filter(
			(
				r
			): r is {
				id: number
				name: string
				number: number
				country_code: string | null
			} => r.id != null && r.name != null && r.number != null
		)
		.map((r) => ({
			id: r.id,
			name: r.name,
			number: r.number,
			country_code: r.country_code
		}))

	if (!wildCardId) return active

	// Fetch the wild card rider separately and append
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

	const wildCard: TPickRider = {
		id: wildCardRaw.id,
		name: wildCardRaw.name,
		number: wildCardRaw.number,
		country_code: wildCardRaw.country_code
	}

	return [...active, wildCard]
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

export function getPicksCount(gpId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_picks')
				.select(db.fn.countAll<number>().as('count'))
				.where('gp_id', '=', gpId)
				.executeTakeFirstOrThrow(),
		{ count: 0 }
	)
}

export async function getPicksRecord() {
	const { record } = await dataFetch(
		() => db.selectFrom('picks_record').selectAll().executeTakeFirstOrThrow(),
		{ record: 0 }
	)
	return { record: Number(record ?? 0) }
}
