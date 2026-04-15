import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { UsersStandings } from '@/components/UsersStandings'
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
			<PageHeader title={metaData.title} />
			<UsersStandings year={yearValues.activeYear} />
		</div>
	)
}
