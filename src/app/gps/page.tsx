import type { Metadata } from 'next'

import { GpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { ShowOlderToggle } from '@/components/ShowOlderToggle'
import { filterGps } from '@/lib/filter-gps'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData } from './[id]/constants'
import { getGps } from './data'

type TGpsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
		show?: string
	}>
}

export const metadata: Metadata = metaData

export default async function GpsPage({ searchParams }: TGpsPage) {
	const { show } = await searchParams
	const yearValues = await getYearValues(searchParams)
	const gps = await getGps(yearValues.activeYear)

	const showAll = show === 'all'
	const isPastYear = Number(yearValues.activeYear) < new Date().getFullYear()
	const { visible, showToggle, isUpNext } = filterGps(gps, showAll, isPastYear)

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={metaData.title} />

			{showToggle && <ShowOlderToggle checked={showAll} />}

			<div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
				{visible.map(({ gp, stage }, i) => (
					<GpCard
						key={gp.id}
						gp={gp}
						isUpNext={i === isUpNext}
						linked
						macroStage={stage}
					/>
				))}
			</div>
		</div>
	)
}
