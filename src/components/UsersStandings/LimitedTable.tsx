import { MedalIcon } from '@/components/MedalIcon'
import { SectionTitle } from '@/components/SectionTitle'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMedalColorStr } from '@/lib/medals'

import { Card } from '../ui/card'
import { type getUsersStandings, getUserStandingRow } from './data'

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

			<Card className="p-0">
				<Table>
					<TableBody>
						{data.map((row) => {
							const { pos } = row
							const isMedal = pos != null && pos <= 3
							return (
								<TableRow key={row.user_id}>
									<TableCell className="pr-0 pl-6">
										<span
											className={`inline-flex size-7 items-center justify-center rounded-md ${isMedal ? `${getMedalColorStr(pos!, 'bg')} text-black` : 'bg-gray-800'}`}
										>
											{pos}
										</span>
									</TableCell>

									<TableCell>
										<UserName
											firstName={row.first_name}
											lastName={row.last_name}
											stars={row.stars}
											userId={row.user_id}
											isViewer={row.user_id === viewerId}
										/>
										<div className="mt-1 flex w-fit items-center gap-2">
											{([1, 2, 3] as const).map((type) => {
												const count = row[`medal_${type}`]
												if (!count) return null
												return (
													<span
														key={type}
														className={`inline-flex items-center gap-1 ${getMedalColorStr(type, 'text')}`}
													>
														{count}
														<MedalIcon type={type} />
													</span>
												)
											})}
										</div>
									</TableCell>

									<TableCell className="text-center">
										<span
											className={`text-lg ${isMedal ? getMedalColorStr(pos!, 'text') : ''}`}
										>
											{row.points}
										</span>
									</TableCell>
								</TableRow>
							)
						})}
						{viewerRow && (
							<TableRow key={viewerRow.user_id} className="bg-orange-400/5">
								<TableCell className="pr-0 pl-6">
									<span className="inline-flex size-7 items-center justify-center rounded-md bg-gray-800">
										{viewerRow.pos}
									</span>
								</TableCell>
								<TableCell>
									<UserName
										firstName={viewerRow.first_name}
										lastName={viewerRow.last_name}
										stars={viewerRow.stars}
										userId={viewerRow.user_id}
										isViewer
									/>
									<div className="mt-1 flex w-fit items-center gap-2">
										{([1, 2, 3] as const).map((type) => {
											const count = viewerRow[`medal_${type}`]
											if (!count) return null
											return (
												<span
													key={type}
													className={`inline-flex items-center gap-1 ${getMedalColorStr(type, 'text')}`}
												>
													{count}
													<MedalIcon type={type} />
												</span>
											)
										})}
									</div>
								</TableCell>
								<TableCell className="text-center">
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
