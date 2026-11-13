import { sql } from 'kysely'

import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

/**
 * The only GP odds can be entered for: the next one to start.
 * Uncached on purpose — the save action checks against it.
 */
export async function getNextOddsGpId(): Promise<number | null> {
	const row = await db
		.selectFrom('gps')
		.select('id')
		.where('start_date', '>', new Date())
		.where('finished', '=', false)
		.orderBy('start_date', 'asc')
		.limit(1)
		.executeTakeFirst()
	return row?.id ?? null
}

/** Every rider who can be in a field (not retired). */
export function getSelectableRiders() {
	return dataFetch(
		() =>
			db
				.selectFrom('riders')
				.select(['id', 'name', 'number', 'active'])
				.where('retired', 'is not', true)
				.orderBy('name', 'asc')
				.execute(),
		[]
	)
}

export type TSelectableRider = Awaited<
	ReturnType<typeof getSelectableRiders>
>[number]

/**
 * Tie-break order for equal odds, best first: SGP points this season before
 * this GP, then active order (all riders on 0 points before GP1 = active order).
 * Throws on DB errors: the save action must not price on a guess.
 */
export async function getTieRanks(gpId: number): Promise<Map<number, number>> {
	const gp = await db
		.selectFrom('gps')
		.select('start_date')
		.where('id', '=', gpId)
		.executeTakeFirstOrThrow()

	const rows = await db
		.selectFrom('riders')
		.leftJoin(
			(eb) =>
				eb
					.selectFrom('riders_results')
					.innerJoin('gps', 'gps.id', 'riders_results.gp_id')
					.select([
						'riders_results.rider_id',
						(eb) => eb.fn.sum<number>('riders_results.points').as('points')
					])
					.where(
						sql<number>`EXTRACT(YEAR FROM gps.start_date)`,
						'=',
						sql<number>`EXTRACT(YEAR FROM ${gp.start_date}::timestamptz)`
					)
					.where('gps.start_date', '<', gp.start_date)
					.groupBy('riders_results.rider_id')
					.as('season'),
			(join) => join.onRef('season.rider_id', '=', 'riders.id')
		)
		.select(['riders.id', 'riders.active', 'riders.name', 'season.points'])
		.where('riders.retired', 'is not', true)
		.execute()

	rows.sort(
		(a, b) =>
			Number(b.points ?? 0) - Number(a.points ?? 0) ||
			(a.active ?? 99) - (b.active ?? 99) ||
			a.name.localeCompare(b.name)
	)

	return new Map(rows.map((r, i) => [r.id, i]))
}

/**
 * The form's starting point: the GP's saved field if it has one, otherwise
 * active 1–15 + the GP's wildcard. Slot 16 is always the wildcard.
 */
export async function getOddsFormData(gpId: number) {
	return dataFetch(async () => {
		const [gp, saved, active, tieRanks] = await Promise.all([
			db
				.selectFrom('gps')
				.innerJoin('cities', 'cities.id', 'gps.city_id')
				.select([
					'gps.id',
					'gps.round',
					'gps.start_date',
					'gps.wild_card_id',
					'cities.name as city_name'
				])
				.where('gps.id', '=', gpId)
				.where('gps.finished', '=', false)
				.executeTakeFirst(),
			db
				.selectFrom('gps_riders')
				.innerJoin('riders', 'riders.id', 'gps_riders.rider_id')
				.select(['gps_riders.rider_id', 'gps_riders.odds', 'riders.active'])
				.where('gps_riders.gp_id', '=', gpId)
				.orderBy('riders.active', (ob) => ob.asc().nullsLast())
				.execute(),
			db
				.selectFrom('riders')
				.select('id')
				.where('active', 'is not', null)
				.orderBy('active', 'asc')
				.execute(),
			getTieRanks(gpId)
		])

		if (!gp) return null

		const wildCardId = gp.wild_card_id
		const permanentIds = saved.length
			? saved.map((r) => r.rider_id).filter((id) => id !== wildCardId)
			: active.map((r) => r.id).filter((id) => id !== wildCardId)

		const oddsById = Object.fromEntries(
			saved.map((r) => [r.rider_id, r.odds != null ? String(r.odds) : ''])
		)

		return {
			gp,
			isFirstSave: saved.length === 0,
			permanentIds: permanentIds.slice(0, 15),
			wildCardId,
			oddsById,
			tieRanks: Object.fromEntries(tieRanks)
		}
	}, null)
}

export type TOddsFormData = NonNullable<
	Awaited<ReturnType<typeof getOddsFormData>>
>
