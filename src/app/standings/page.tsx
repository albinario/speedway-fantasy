import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { RidersStandings } from '@/components/RidersStandings'
import { UsersStandings } from '@/components/UsersStandings'
import type { TUsersForm } from '@/components/UsersStandings'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './constants'
import { FormToggle } from './FormToggle'
import { StandingsToggle } from './StandingsToggle'

type TStandingsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
		view?: string
		form?: string
	}>
}

export const metadata: Metadata = metaData

const formValues: TUsersForm[] = ['total', 'last2', 'last4']

export default async function StandingsPage({ searchParams }: TStandingsPage) {
	const resolved = await searchParams
	const yearValues = await getYearValues(searchParams)
	const view = resolved.view === 'riders' ? 'riders' : 'players'
	const isCurrentYear = yearValues.activeYear === yearValues.years?.[0]?.value
	const form =
		isCurrentYear && formValues.includes(resolved.form as TUsersForm)
			? (resolved.form as TUsersForm)
			: 'total'

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={metaData.title} />

			<StandingsToggle view={view}>
				{view === 'players' ? (
					isCurrentYear ? (
						<FormToggle form={form}>
							<UsersStandings year={yearValues.activeYear} form={form} />
						</FormToggle>
					) : (
						<UsersStandings year={yearValues.activeYear} form={form} />
					)
				) : (
					<RidersStandings year={yearValues.activeYear} />
				)}
			</StandingsToggle>
		</div>
	)
}
