import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { RidersTable } from '@/components/RidersTable'
import { paramValues, type TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './constants'
import { getRidersActive, getRidersStandings } from './data'
import { RidersActive } from './RidersActive'

type TRidersPage = {
	searchParams: Promise<{
		year?: string | TParamValues
	}>
}

export const metadata: Metadata = metaData

export default async function RidersPage({ searchParams }: TRidersPage) {
	const yearValues = await getYearValues(searchParams)
	const ridersStandings = await getRidersStandings(yearValues.activeYear)
	const ridersActive =
		ridersStandings.length <= 0 ? await getRidersActive() : []

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={metaData.title} />

			{ridersStandings.length > 0 ? (
				<RidersTable
					condensedMedals={yearValues.activeYear === paramValues.all}
					data={ridersStandings.map((r) => ({
						riderId: r.rider_id,
						name: r.name,
						countryCode: r.country_code,
						number: r.number,
						medals: r.medals,
						points: r.total_points,
						heats: r.heats,
						gps: r.gps,
						timesPicked: r.times_picked
					}))}
				/>
			) : ridersActive.length > 0 ? (
				<RidersActive riders={ridersActive} />
			) : null}
		</div>
	)
}
