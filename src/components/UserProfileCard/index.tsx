import { MedalIcon as MedalIconComponent } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { getMedalColorHex } from '@/lib/medals'
import type { getUserStandingRow } from '@/components/UsersStandings/data'
import { PosBadge } from '@/components/PosBadge'

type TUserProfileCard = {
	standings: Awaited<ReturnType<typeof getUserStandingRow>>
}

export function UserProfileCard({ standings }: TUserProfileCard) {
	if (!standings) return null

	const medals = [
		{ type: 1, count: standings.medal_1 },
		{ type: 2, count: standings.medal_2 },
		{ type: 3, count: standings.medal_3 }
	]

	return (
		<Card className="mx-auto w-full">
			<CardContent className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<PosBadge pos={standings.pos} prevPos={standings.prev_pos} />
					<span className="text-muted-foreground text-xs">
						{standings.year ?? 'All time'}
					</span>
				</div>

				<div className="grid grid-cols-3 gap-2 text-center">
					<div className="flex flex-col">
						<span className="text-2xl font-black">{Number(standings.points)}</span>
						<span className="text-muted-foreground text-xs">Points</span>
					</div>
					<div className="flex flex-col">
						<span className="text-2xl font-black">{Number(standings.gps)}</span>
						<span className="text-muted-foreground text-xs">GPs</span>
					</div>
					<div className="flex flex-col">
						<span className="text-2xl font-black">{Number(standings.heats)}</span>
						<span className="text-muted-foreground text-xs">Heats</span>
					</div>
				</div>

				<div className="flex justify-around">
					{medals.map(({ type, count }) => {
						const color = getMedalColorHex(type)
						return (
							<div key={type} className="flex items-center gap-1.5">
								<MedalIconComponent className="size-4" stroke={color} />
								<span className="text-sm font-semibold">{Number(count)}</span>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}
