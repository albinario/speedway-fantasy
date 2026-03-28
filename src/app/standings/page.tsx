import type { Metadata } from 'next'


import { YearSelector } from '@/components/YearSelector'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './constants'
import { getUsersStandings } from './data'
import { UsersStandingsTable } from './UsersStandingsTable'

type TStandingsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
	}>
}

export const metadata: Metadata = metaData

export default async function StandingsPage({ searchParams }: TStandingsPage) {
	const yearValues = await getYearValues(searchParams)
	const usersStandings = await getUsersStandings(yearValues.activeYear, 10)

	return (
		<>
			<div className="flex items-center justify-between py-4">
				<h1 className="font-black uppercase">{metaData.title}</h1>

				<YearSelector yearValues={yearValues} />
			</div>

			{usersStandings.length > 0 && (
				<UsersStandingsTable data={usersStandings} />
			)}
		</>
	)
}
