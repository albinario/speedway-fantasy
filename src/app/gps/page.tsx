import type { Metadata } from 'next'

import { GpCard } from '@/components/GpCard'
import { PageTitle } from '@/components/PageTitle'
import { ScrollToId } from '@/components/ScrollToId'
import { YearSelector } from '@/components/YearSelector'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './constants'
import { getGps } from './data'

type TGpsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
	}>
}

export const metadata: Metadata = metaData

function getMacroStage(
	startDate: Date | string | null | undefined,
	finished: boolean | null | undefined
): EMacroStage {
	if (finished) return EMacroStage.After
	if (startDate && new Date(startDate) <= new Date()) return EMacroStage.During
	return EMacroStage.Before
}

export default async function GpsPage({ searchParams }: TGpsPage) {
	const yearValues = await getYearValues(searchParams)
	const [viewer, gps] = await Promise.all([
		getViewer(),
		getGps(yearValues.activeYear)
	])

	return (
		<>
			<ScrollToId id="up-next" />

			<div className="flex items-center justify-between py-4">
				<PageTitle title={metaData.title} />

				<YearSelector yearValues={yearValues} />
			</div>

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
								macroStage={stages[i]}
								isUpNext={i === isUpNext}
								viewerId={viewer?.db?.id}
							/>
						))}
					</div>
				)
			})()}
		</>
	)
}
