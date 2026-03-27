import type { Metadata } from 'next'

import { Fragment } from 'react/jsx-runtime'

import { YearSelector } from '@/components/YearSelector'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './constants'
import { getRidersActive, getRidersStandings } from './data'
import { RidersActive } from './RidersActive'
import { RidersStandingsTable } from './RidersStandingsTable'

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
		<Fragment>
			<div className="flex items-center justify-between py-4">
				<h1 className="font-black uppercase">{metaData.title}</h1>

				<YearSelector yearValues={yearValues} />
			</div>

			{ridersStandings.length > 0 ? (
				<RidersStandingsTable data={ridersStandings} />
			) : ridersActive.length > 0 ? (
				<RidersActive riders={ridersActive} />
			) : null}
		</Fragment>
	)
}
