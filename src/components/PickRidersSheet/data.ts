import type { TRider } from '@/components/RiderTile'
import { cacheTags } from '@/lib/cache-tags'
import { cachedQuery } from '@/lib/cached-query'
import { db } from '@/lib/db'

export type TFieldRider = TRider & {
	coins: number | null
	/** In the viewer's team but no longer in this GP's field (replaced) */
	isOut?: boolean
}

export const getGpField = cachedQuery(
	(gpId: number) => _getGpField(gpId),
	['gp-field'],
	// Flushed by the admin odds form (saveOddsAction)
	{ tags: [cacheTags.gpField], fallback: [] }
)

/** A GP's field from gps_riders (2027+), most expensive first. Empty before the field is set. */
async function _getGpField(gpId: number): Promise<TFieldRider[]> {
	const rows = await db
		.selectFrom('gps_riders')
		.innerJoin('riders_with_country as r', 'r.id', 'gps_riders.rider_id')
		.innerJoin('riders', 'riders.id', 'gps_riders.rider_id')
		.select([
			'r.id',
			'r.name',
			'r.number',
			'r.country_code',
			'gps_riders.coins'
		])
		.where('gps_riders.gp_id', '=', gpId)
		.orderBy('gps_riders.coins', (ob) => ob.desc().nullsLast())
		.orderBy('riders.active', (ob) => ob.asc().nullsLast())
		.execute()

	return rows.filter(
		(r): r is TFieldRider => r.id != null && r.name != null && r.number != null
	)
}
