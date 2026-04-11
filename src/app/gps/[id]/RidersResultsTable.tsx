'use client'

import { RidersTable } from '@/components/RidersTable'

import type { getGpRidersResults } from './data'

type TGpRidersResultsTable = {
	data: Awaited<ReturnType<typeof getGpRidersResults>>
}

export function GpRidersResultsTable({ data }: TGpRidersResultsTable) {
	return (
		<RidersTable
			data={data.map((r) => ({
				riderId: r.rider_id,
				name: r.name,
				countryCode: r.country_code,
				number: r.number,
				medals: r.medal != null ? [r.medal] : undefined,
				points: r.points,
				heats: r.heats,
				timesPicked: r.times_picked ?? 0
			}))}
		/>
	)
}
