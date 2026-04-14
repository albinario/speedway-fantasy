import { MedalCounts } from '@/components/MedalCounts'
import { SectionTitle } from '@/components/SectionTitle'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMedalColorStr } from '@/lib/medals'

import { Card } from '../ui/card'
import { type getUsersStandings, getUserStandingRow } from './data'
import { PosBadge } from './PosBadge'

type TRow = Awaited<ReturnType<typeof getUsersStandings>>[number]

export async function UsersLimitedTable({
	data,
	limit
}: {
	data: TRow[]
	limit?: number
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

			<Card className="bg-surface">
				<Table>
					<TableBody>
						{data.map((row) => {
							const { pos, prev_pos } = row
							return (
								<TableRow key={row.user_id}>
									<TableCell className="pr-0">
										<PosBadge pos={pos} prevPos={prev_pos} />
									</TableCell>

									<TableCell>
										<UserName
											firstName={row.first_name}
											lastName={row.last_name}
											stars={row.stars}
											userId={row.user_id}
											isViewer={row.user_id === viewerId}
										/>
										<div className="mt-1">
											<MedalCounts
												medal_1={Number(row.medal_1)}
												medal_2={Number(row.medal_2)}
												medal_3={Number(row.medal_3)}
											/>
										</div>
									</TableCell>

									<TableCell className="text-end">
										<span
											className={`text-lg ${pos != null && pos <= 3 ? getMedalColorStr(pos, 'text') : ''}`}
										>
											{row.points}
										</span>
									</TableCell>
								</TableRow>
							)
						})}
						{viewerRow && (
							<TableRow key={viewerRow.user_id} className="bg-orange-400/5">
								<TableCell className="pr-0">
									<PosBadge pos={viewerRow.pos} prevPos={viewerRow.prev_pos} />
								</TableCell>
								<TableCell>
									<UserName
										firstName={viewerRow.first_name}
										lastName={viewerRow.last_name}
										stars={viewerRow.stars}
										userId={viewerRow.user_id}
										isViewer
									/>
									<div className="mt-1">
										<MedalCounts
											medal_1={Number(viewerRow.medal_1)}
											medal_2={Number(viewerRow.medal_2)}
											medal_3={Number(viewerRow.medal_3)}
										/>
									</div>
								</TableCell>
								<TableCell className="text-end">
									<span className="text-lg">{viewerRow.points}</span>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Card>
		</div>
	)
}
