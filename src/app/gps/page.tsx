import type { Metadata } from 'next'

import { GpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { ScrollToId } from '@/components/ScrollToId'
import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './[id]/constants'
import { getGps } from './data'

type TGpsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
	}>
}

export const metadata: Metadata = metaData

export default async function GpsPage({ searchParams }: TGpsPage) {
	const yearValues = await getYearValues(searchParams)
	const [gps] = await Promise.all([getGps(yearValues.activeYear)])

	return (
		<>
			<ScrollToId id="up-next" />
			<PageHeader title={metaData.title} />

			{(() => {
				const stages = gps.map((gp) =>
					getMacroStage(gp.start_date, gp.finished)
				)
				const isUpNext = stages.indexOf(EMacroStage.Before)

				return (
					<div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{gps.map((gp, i) => (
							<GpCard
								key={gp.id}
								gp={gp}
								isUpNext={i === isUpNext}
								linked
								macroStage={stages[i]}
							/>
						))}
					</div>
				)
			})()}
		</>
	)
}
