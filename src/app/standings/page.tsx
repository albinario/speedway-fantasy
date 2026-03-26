import type { Metadata } from 'next'

import { Fragment } from 'react/jsx-runtime'

import { RidersStandings } from '@/components/RidersStandings'
import { UsersStandings } from '@/components/UsersStandings'
import { YearSelector } from '@/components/YearSelector'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './constants'

type TStandingsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
	}>
}

export const metadata: Metadata = metaData

export default async function StandingsPage({ searchParams }: TStandingsPage) {
	const yearValues = await getYearValues(searchParams)

	return (
		<Fragment>
			<div className="flex items-center justify-between py-4">
				<h1 className="font-black uppercase">{metaData.title}</h1>
				<YearSelector yearValues={yearValues} />
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<UsersStandings activeYear={yearValues.activeYear} limit={10} />
				<RidersStandings activeYear={yearValues.activeYear} limit={10} />
			</div>
		</Fragment>
	)
}
