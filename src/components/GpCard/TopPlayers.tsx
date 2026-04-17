import { getGpTopUsers, getGpUserResult } from '@/app/gps/data'
import { InfoBox } from '@/components/InfoBox'
import { MedalIcon } from '@/components/MedalIcon'
import { UserName } from '@/components/UserName'
import { PosBadge } from '@/components/UsersStandings/PosBadge'
import { getViewer } from '@/lib/auth/get-viewer'
import { buildMedals, getMedalColorStr } from '@/lib/medals'

type TTopPlayers = {
	gpId: number
	limit?: number
}

export async function TopPlayers({ gpId, limit = 3 }: TTopPlayers) {
	const [rows, viewer] = await Promise.all([
		getGpTopUsers(gpId, limit),
		getViewer()
	])
	const userId = viewer?.db?.id

	const validRows = rows.filter(
		(r): r is typeof r & { id: number } => r.id != null
	)
	if (!validRows.length || validRows[0].points === 0) return null

	const viewerInTop = validRows.some((r) => r.id === userId)
	const viewerRow =
		userId && !viewerInTop ? await getGpUserResult(gpId, userId) : undefined

	return (
		<InfoBox className="flex flex-col gap-4 pb-0">
			<div className="font-black uppercase">
				Top <span className="text-green-400">{limit}</span> players
			</div>

			<div className="divide-border -mx-3 divide-y">
				{validRows.map((row, i) => {
					const medals = buildMedals(row)

					return (
						<div key={row.id!} className="flex items-center gap-2 px-3 py-2">
							<PosBadge pos={i + 1} />

							<div className="min-w-0 flex-1">
								<UserName
									userId={row.id!}
									firstName={row.first_name}
									lastName={row.last_name}
									stars={row.stars}
									isViewer={row.id === userId}
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

								<span
									className={`text-lg ${getMedalColorStr(i + 1, 'text') ?? ''}`}
								>
									{row.points}
								</span>
							</div>
						</div>
					)
				})}

				{viewerRow != null && viewerRow.id != null && (
					<div
						key={viewerRow.id}
						className="flex items-center gap-2 bg-orange-400/5 px-3 py-2"
					>
						<PosBadge pos={viewerRow.pos} />

						<div className="min-w-0 flex-1">
							<UserName
								userId={viewerRow.id}
								firstName={viewerRow.first_name}
								lastName={viewerRow.last_name}
								stars={viewerRow.stars}
								isViewer
							/>
						</div>

						<span className="text-lg">{viewerRow.points}</span>
					</div>
				)}
			</div>
		</InfoBox>
	)
}
