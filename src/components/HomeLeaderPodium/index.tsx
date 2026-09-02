import { SectionTitle } from '@/components/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { getUsersStandings } from '@/components/UsersStandings/data'
import { getMedalColorHex } from '@/lib/medals'
import type { TParamValues } from '@/lib/params'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = { year: number | TParamValues }

export async function HomeLeaderPodium({ year }: Props) {
	const standings = await getUsersStandings(year, 3)
	if (!standings.length) return null

	// Podium order: 2nd (left), 1st (center/tallest), 3rd (right)
	const byPos = {
		1: standings[0],
		2: standings[1],
		3: standings[2],
	}
	const podium = [byPos[2], byPos[1], byPos[3]].filter(Boolean)

	return (
		<div>
			<SectionTitle href="/standings" linkLabel="View all">
				Season <span className="text-green-400">standings</span>
			</SectionTitle>
			<Card>
				<CardContent className="flex items-end gap-2">
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
				</CardContent>
			</Card>
		</div>
	)
}
