import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { getViewer } from '@/lib/auth/get-viewer'

import { HallOfFameCard } from './Card'
import { metaData, noData } from './constants'
import { getHallOfFame } from './data'

export const metadata: Metadata = metaData

export default async function HallOfFamePage() {
	const [hallOfFame, viewer] = await Promise.all([getHallOfFame(), getViewer()])
	const viewerId = viewer?.db?.id

	if (!hallOfFame?.length) return <p>{noData}</p>

	const byYear = Map.groupBy(hallOfFame, (row) => row.year)
	const years = [...byYear.keys()].sort((a, b) => b - a)

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={metaData.title} hideYearSelector />

			<div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
				{years.map((year, i) => {
					const entries = byYear.get(year)!.sort((a, b) => a.type - b.type)

					return (
						<HallOfFameCard
							key={year}
							year={year}
							entries={entries}
							viewerId={viewerId}
							glow={i === 0}
						/>
					)
				})}
			</div>
		</div>
	)
}
