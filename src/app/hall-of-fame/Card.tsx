import { StarIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserName } from '@/components/UserName'
import { getMedalColorHex } from '@/lib/medals'

import type { getHallOfFame } from './data'

type Entry = Awaited<ReturnType<typeof getHallOfFame>>[number]

type Props = {
	entries: Entry[]
	viewerId?: number | null
	year: number
}

export function HallOfFameCard({ entries, viewerId, year }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="font-black">{year}</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-3">
				{entries.map((entry) => {
					const medalColor = getMedalColorHex(entry.type)

					return (
						<div key={entry.id} className="flex flex-wrap items-center gap-2">
							<StarIcon
								className="size-4 shrink-0"
								fill={medalColor}
								stroke={medalColor}
							/>

							<span className="min-w-0">
								<UserName
									firstName={entry.first_name}
									lastName={entry.last_name}
									userId={entry.user_id}
									isViewer={entry.user_id === viewerId}
								/>
							</span>

							<span className="text-muted-foreground ml-auto text-xs whitespace-nowrap tabular-nums">
								{entry.points} pts
							</span>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}
