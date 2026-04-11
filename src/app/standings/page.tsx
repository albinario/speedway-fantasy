import type { Metadata } from 'next'

import { PageTitle } from '@/components/PageTitle'
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
		<div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4">
			<div className="flex items-center justify-between">
				<PageTitle title={metaData.title} />
				<YearSelector yearValues={yearValues} />
			</div>

			<UsersStandings year={yearValues.activeYear} />
		</div>
	)
}
