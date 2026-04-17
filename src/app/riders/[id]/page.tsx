import { RiderGpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { RiderHero } from '@/components/RiderHero'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { getRider, getRiderGps, getRiderStats } from './data'

type TRiderPage = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ year?: string | TParamValues }>
}

export default async function RiderPage({ params, searchParams }: TRiderPage) {
	const { id } = await params
	const riderId = Number(id)

	const [rider, yearValues] = await Promise.all([
		getRider(riderId),
		getYearValues(searchParams)
	])

	if (!rider) return null

	const [gps, stats] = await Promise.all([
		getRiderGps(riderId, yearValues.activeYear),
		getRiderStats(riderId, yearValues.activeYear)
	])

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={rider.name} />

			<RiderHero
				countryCode={rider.country_code}
				name={rider.name}
				number={rider.number}
				riderId={riderId}
				stats={stats}
			/>

			<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
				{gps.map((gp) => (
					<RiderGpCard key={gp.id} gp={gp} />
				))}
			</div>
		</div>
	)
}
