import { getGpTopUsers, getGpUserResult } from '@/app/gps/[id]/data'
import { MedalIcon } from '@/components/MedalIcon'
import { UserName } from '@/components/UserName'
import { PosBadge } from '@/components/UsersStandings/PosBadge'
import { getViewer } from '@/lib/auth/get-viewer'
import { buildMedals } from '@/lib/medals'

type TTopPlayers = {
	gpId: number
	limit?: number
}

export async function GpTopPlayers({ gpId, limit = 3 }: TTopPlayers) {
	const [rows, viewer] = await Promise.all([
		getGpTopUsers(gpId, limit),
		getViewer()
	])
	const viewerId = viewer?.db?.id

	const validRows = rows.filter(
		(r): r is typeof r & { id: number } => r.id != null
	)
	if (!validRows.length || validRows[0].points === 0) return null

	const topIds = new Set(validRows.map((r) => r.id))
	const viewerInTop = viewerId != null && topIds.has(viewerId)
	const viewerRow =
		viewerId != null && !viewerInTop
			? await getGpUserResult(gpId, viewerId)
			: undefined

	const extraRows =
		viewerRow?.id != null
			? [viewerRow as typeof viewerRow & { id: number }]
			: []
	const displayRows = [...validRows, ...extraRows]

	return (
		<div className="flex flex-col gap-2">
			<div className="font-black uppercase">
				Top <span className="text-green-400">{limit}</span> players
			</div>

			<div className="divide-border -mx-3 divide-y">
				{displayRows.map((row, i) => {
					const isViewer = row.id === viewerId
					const medals = buildMedals(row)

					return (
						<div
							key={row.id}
							className={`flex items-center gap-2 px-3 py-2 ${isViewer ? 'bg-orange-400/5' : ''}`}
						>
							<PosBadge
								pos={row.pos}
								tiedPos={i < limit && row.pos !== i + 1}
							/>

							<div className="min-w-0 flex-1">
								<UserName
									userId={row.id!}
									firstName={row.first_name}
									lastName={row.last_name}
									isViewer={isViewer}
									stars={row.stars}
								/>
							</div>

							<div className="flex items-center gap-2">
								{medals.length > 0 && (
									<div className="flex gap-1">
										{medals.map((m, j) => (
											<MedalIcon key={j} type={m} />
										))}
									</div>
								)}

								<span className="text-lg">{row.points}</span>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
