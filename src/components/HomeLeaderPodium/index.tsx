import Link from 'next/link'

import { PosBadge } from '@/components/PosBadge'
import { SectionTitle } from '@/components/SectionHeader'
import { Card, CardContent, CardGlow } from '@/components/ui/card'
import { UserName } from '@/components/UserName'
import {
	getUsersStandings,
	getUserStandingRow
} from '@/components/UsersStandings/data'
import { getMedalColorHex } from '@/lib/medals'
import type { TParamValues } from '@/lib/params'
import { cn } from '@/lib/utils'

type Props = { year: number | TParamValues; viewerId?: number }

export async function HomeLeaderPodium({ year, viewerId }: Props) {
	const [standings, viewerRow] = await Promise.all([
		getUsersStandings(year, 3),
		viewerId ? getUserStandingRow(year, viewerId) : Promise.resolve(null)
	])
	if (!standings.length) return null

	const showViewerRow =
		!!viewerRow && !standings.some((s) => s.user_id === viewerId)

	// Podium order: 2nd (left), 1st (center/tallest), 3rd (right)
	const byPos = {
		1: standings[0],
		2: standings[1],
		3: standings[2]
	}
	const podium = [byPos[2], byPos[1], byPos[3]].filter(Boolean)

	return (
		<div>
			<SectionTitle href="/standings" linkLabel="View all">
				Current <span className="text-green-400">podium</span>
			</SectionTitle>

			<Card className="relative isolate">
				<CardGlow color="gold" position="top" />

				<CardContent className="flex flex-col gap-3">
					<div className="flex items-end gap-2">
						{podium.map((entry, idx) => {
							const pos = idx === 0 ? 2 : idx === 1 ? 1 : 3
							const isWinner = pos === 1
							const medalColor = getMedalColorHex(pos)
							const initials = [entry.first_name, entry.last_name]
								.filter(Boolean)
								.map((n) => n![0])
								.join('')
								.toUpperCase()

							return (
								<div
									key={entry.user_id}
									className="flex flex-1 flex-col items-center gap-2 rounded-lg border p-3 text-center"
									style={{ borderColor: medalColor }}
								>
									<div
										className={cn(
											'flex items-center justify-center rounded-full border-2 bg-white/10 font-bold',
											isWinner ? 'size-16 text-base' : 'size-12 text-sm'
										)}
										style={{ borderColor: medalColor, color: medalColor }}
									>
										{initials}
									</div>

									<div className="flex flex-col items-center gap-0.5">
										<Link
											href={`/users/${entry.user_id}`}
											className={cn(
												'leading-tight font-bold',
												isWinner ? 'text-sm' : 'text-xs'
											)}
										>
											{entry.first_name} {entry.last_name}
										</Link>

										<span className={isWinner ? 'text-sm' : 'text-xs'}>
											<span className="font-bold tabular-nums">
												{Number(entry.points)}
											</span>{' '}
											<span className="text-muted-foreground text-xs">pts</span>
										</span>
									</div>
								</div>
							)
						})}
					</div>

					{showViewerRow && viewerRow && (
						<div className="flex items-center justify-between border-t pt-3">
							<div className="flex items-center gap-2">
								<PosBadge
									pos={viewerRow.pos ?? standings.length + 1}
									prevPos={viewerRow.prev_pos}
								/>

								<UserName
									firstName={viewerRow.first_name}
									lastName={viewerRow.last_name}
									stars={viewerRow.stars}
									userId={viewerRow.user_id}
									isViewer
								/>
							</div>

							<span className="text-sm">
								<span className="font-bold tabular-nums">
									{Number(viewerRow.points)}
								</span>{' '}
								<span className="text-muted-foreground text-xs">pts</span>
							</span>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
