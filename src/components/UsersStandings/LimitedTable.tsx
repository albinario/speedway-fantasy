import { MedalCounts } from '@/components/MedalCounts'
import { SectionTitle } from '@/components/SectionHeader'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'

import { Card } from '../ui/card'
import { type getUsersStandings, getUserStandingRow } from './data'
import { PosBadge } from './PosBadge'

type TRow = Awaited<ReturnType<typeof getUsersStandings>>[number]

function StandingRow({
	tiedPos,
	isViewer,
	row
}: {
	tiedPos?: boolean
	isViewer?: boolean
	row: TRow
}) {
	return (
		<div
			className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 ${isViewer ? 'bg-orange-400/5' : ''}`}
		>
			{row.pos != null && (
				<div className="w-15">
					<PosBadge
						tiedPos={tiedPos}
						pos={row.pos}
						prevPos={row.prev_pos}
						size="lg"
					/>
				</div>
			)}

			<div className="flex min-w-0 items-center gap-2">
				<div className="min-w-0">
					<UserName
						firstName={row.first_name}
						lastName={row.last_name}
						stars={row.stars}
						userId={row.user_id}
						isViewer={isViewer}
					/>
					<div className="mt-1">
						<MedalCounts
							medal_1={Number(row.medal_1)}
							medal_2={Number(row.medal_2)}
							medal_3={Number(row.medal_3)}
						/>
					</div>
				</div>
			</div>

			<span className="justify-self-end text-lg">{row.points}</span>
		</div>
	)
}

export async function UsersLimitedTable({
	data,
	limit
}: {
	data: TRow[]
	limit: number
}) {
	const viewer = await getViewer()
	const viewerId = viewer?.db?.id
	const viewerInList = data.some((r) => r.user_id === viewerId)
	const viewerRow =
		viewerId && !viewerInList
			? ((await getUserStandingRow(data[0]?.year ?? 0, viewerId)) ?? undefined)
			: undefined

	return (
		<div>
			<SectionTitle href="/standings">
				Top <span className="text-xl text-green-400">{limit}</span> players
			</SectionTitle>

			<Card className="divide-border divide-y overflow-hidden py-0">
				{data.map((row, i) => (
					<StandingRow
						key={row.user_id}
						tiedPos={row.pos !== i + 1}
						isViewer={row.user_id === viewerId}
						row={row}
					/>
				))}
				{viewerRow && <StandingRow isViewer row={viewerRow} />}
			</Card>
		</div>
	)
}
