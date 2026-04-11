import { getRidersStandings } from '@/app/riders/data'
import { RidersTable } from '@/components/RidersTable'
import type { TParamValues } from '@/lib/params'

import { RidersLimitedTable } from './LimitedTable'

type TRidersStandings = {
	year: number | TParamValues
	limit?: number
}

export async function RidersStandings({ year, limit }: TRidersStandings) {
	const standings = await getRidersStandings(year, limit)

	if (!standings.length) return null

	if (limit !== undefined) {
		return <RidersLimitedTable data={standings} />
	}

	const data = standings.map((r) => ({
		riderId: r.rider_id,
		name: r.name,
		countryCode: r.country_code,
		number: r.number,
		medals: r.medals,
		points: r.total_points,
		heats: r.heats,
		gps: r.gps,
		timesPicked: r.times_picked
	}))

	return <RidersTable data={data} />
}
