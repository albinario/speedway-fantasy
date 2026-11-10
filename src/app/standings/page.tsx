import { getTranslations } from 'next-intl/server'

import { PageHeader } from '@/components/PageHeader'
import { RidersStandings } from '@/components/RidersStandings'
import { UsersStandings } from '@/components/UsersStandings'
import type { TUsersForm } from '@/components/UsersStandings'
import { getLatestStandingsYear } from '@/data/year'
import { getPageMetadata } from '@/i18n/page-metadata'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { FormToggle } from './FormToggle'
import { StandingsToggle } from './StandingsToggle'

type TStandingsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
		view?: string
		form?: string
	}>
}

export const generateMetadata = () => getPageMetadata('standings')

const formValues: TUsersForm[] = ['total', 'last2', 'last4']

export default async function StandingsPage({ searchParams }: TStandingsPage) {
	const tPages = await getTranslations('Pages')
	const resolved = await searchParams
	const latestStandingsYear = await getLatestStandingsYear()
	const yearValues = await getYearValues(searchParams, latestStandingsYear)
	const view = resolved.view === 'riders' ? 'riders' : 'players'
	const isCurrentYear = yearValues.activeYear === yearValues.latestYear
	const form =
		isCurrentYear && formValues.includes(resolved.form as TUsersForm)
			? (resolved.form as TUsersForm)
			: 'total'

	return (
		<div className="flex flex-col gap-4">
			<PageHeader
				title={tPages('standings.title')}
				defaultYear={latestStandingsYear}
			/>

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
