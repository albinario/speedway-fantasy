import { PosBadge } from '@/components/PosBadge'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import { UserName } from '@/components/UserName'

import type { getGpUsersWithStandings } from './data'

type TRow = Awaited<ReturnType<typeof getGpUsersWithStandings>>[number]

type Props = {
	data: TRow[]
	viewerId?: number
}

export function GpUsersStandingsTable({ data, viewerId }: Props) {
	if (!data.length) return null

	return (
		<div>
			<SectionTitle>Players</SectionTitle>
			<Card className="divide-y">
				{data.map((row) => (
					<div key={row.user_id} className="flex items-center gap-3 px-3 py-2">
						<PosBadge pos={row.pos} />
						<UserName
							userId={row.user_id}
							firstName={row.first_name}
							lastName={row.last_name}
							stars={row.stars}
							isViewer={row.user_id === viewerId}
							className="flex-1 truncate"
						/>
						<span className="text-muted-foreground text-sm tabular-nums">
							{row.season_points ?? 0}
						</span>
					</div>
				))}
			</Card>
		</div>
	)
}
