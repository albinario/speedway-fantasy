import Link from 'next/link'

import { ChevronRight } from 'lucide-react'

import { MedalIcon } from '@/components/MedalIcon'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { UserName } from '@/components/UserName'
import { getMedalColor } from '@/lib/medals'

import type { getUsersStandings } from './data'

type TRow = Awaited<ReturnType<typeof getUsersStandings>>[number]

export function UsersLimitedTable({
	data,
	viewerId
}: {
	data: TRow[]
	viewerId?: number
}) {
	return (
		<Card className="bg-black p-0">
			<Table>
				<TableBody>
					{data.map((row, i) => {
						const { pos } = row
						const isFirst = pos === i + 1
						const isMedal = pos != null && pos <= 3

						return (
							<TableRow key={row.user_id}>
								<TableCell>
									{isFirst ? (
										<span
											className="inline-flex size-7 items-center justify-center rounded-md bg-gray-800"
											style={
												isMedal
													? {
															backgroundColor: getMedalColor(pos!),
															color: 'black'
														}
													: undefined
											}
										>
											{pos}
										</span>
									) : null}
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
													className="inline-flex items-center gap-1"
													style={{ color: getMedalColor(type) }}
												>
													{count}
													<MedalIcon type={type} />
												</span>
											)
										})}
									</div>
								</TableCell>
								<TableCell className="text-center">
									<span className="text-lg">{row.points}</span>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
			<div className="p-3 pt-0">
				<Button asChild variant="shale" className="w-full">
					<Link href="/standings">
						View all standings <ChevronRight />
					</Link>
				</Button>
			</div>
		</Card>
	)
}
