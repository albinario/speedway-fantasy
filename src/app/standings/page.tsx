import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { RidersStandings } from '@/components/RidersStandings'
import { UsersStandings } from '@/components/UsersStandings'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './constants'
import { StandingsToggle } from './StandingsToggle'

type TStandingsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
		view?: string
	}>
}

export const metadata: Metadata = metaData

export default async function StandingsPage({ searchParams }: TStandingsPage) {
	const resolved = await searchParams
	const yearValues = await getYearValues(searchParams)
	const view = resolved.view === 'riders' ? 'riders' : 'players'

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={metaData.title} />
			<StandingsToggle view={view} />

			{view === 'players' ? (
				<UsersStandings year={yearValues.activeYear} />
			) : (
				<RidersStandings year={yearValues.activeYear} />
			)}
		</div>
	)
}
