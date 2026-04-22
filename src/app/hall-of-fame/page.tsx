import type { Metadata } from 'next'

import { StarIcon } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMedalColorHex } from '@/lib/medals'

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

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{years.map((year) => {
					const entries = byYear.get(year)!.sort((a, b) => a.type - b.type)

					return (
						<Card key={year}>
							<CardHeader>
								<CardTitle>{year}</CardTitle>
							</CardHeader>

							<CardContent className="flex flex-col gap-3">
								{entries.map((entry) => {
									const medalColor = getMedalColorHex(entry.type)

									return (
										<div key={entry.id} className="flex items-center gap-2">
											<StarIcon
												className="size-4 shrink-0"
												fill={medalColor}
												stroke={medalColor}
											/>

											<UserName
												firstName={entry.first_name}
												lastName={entry.last_name}
												userId={entry.user_id}
												isViewer={entry.user_id === viewerId}
											/>
											<span className="text-muted-foreground ml-auto text-xs tabular-nums">
												{entry.points} pts
											</span>
										</div>
									)
								})}
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
