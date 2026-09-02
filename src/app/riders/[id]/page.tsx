import { FlagNumber } from '@/components/FlagNumber'
import { RiderGpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { RiderHero } from '@/components/RiderHero'
import { RiderImage } from '@/components/RiderImage'
import { ShowOlderToggle } from '@/components/ShowOlderToggle'
import { filterGps } from '@/lib/filter-gps'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { getRider, getRiderGps, getRiderStats } from './data'

type TRiderPage = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ year?: string | TParamValues; show?: string }>
}

export default async function RiderPage({ params, searchParams }: TRiderPage) {
	const { id } = await params
	const riderId = Number(id)
	const { show } = await searchParams

	const [rider, yearValues] = await Promise.all([
		getRider(riderId),
		getYearValues(searchParams)
	])

	if (!rider) return null

	const [gps, stats] = await Promise.all([
		getRiderGps(riderId, yearValues.activeYear),
		getRiderStats(riderId, yearValues.activeYear)
	])

	const showAll = show === 'all'
	const isPastYear = Number(yearValues.activeYear) < new Date().getFullYear()
	const { visible, showToggle } = filterGps(gps, showAll, isPastYear)

	return (
		<div className="flex flex-col gap-4">
			<PageHeader>
				<div className="flex items-center gap-2">
					<RiderImage
						className="size-12 shrink-0"
						name={rider.name}
						riderId={riderId}
					/>
					<div className="flex flex-col">
						<span className="text-xl font-black uppercase">{rider.name}</span>
						<FlagNumber
							countryCode={rider.country_code}
							number={rider.number}
							size="sm"
						/>
					</div>
				</div>
			</PageHeader>

			<RiderHero stats={stats} />

			{showToggle && <ShowOlderToggle checked={showAll} />}

			<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
				{visible.map(({ gp }) => (
					<RiderGpCard key={gp.id} gp={gp} />
				))}
			</div>
		</div>
	)
}
