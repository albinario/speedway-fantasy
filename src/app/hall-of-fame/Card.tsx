import Link from 'next/link'

import { Star } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { colors } from '@/config/brand'
import { getMedalColorHex } from '@/lib/medals'
import { cn } from '@/lib/utils'

import type { getHallOfFame } from './data'

type Entry = Awaited<ReturnType<typeof getHallOfFame>>[number]

type Props = {
	entries: Entry[]
	viewerId?: number | null
	year?: number
}

export function HallOfFameCard({ entries, viewerId, year }: Props) {
	const byType = Object.fromEntries(entries.map((e) => [e.type, e]))
	const podium = [byType[2], byType[1], byType[3]].filter(Boolean)

	return (
		<Card>
			{year && (
				<CardHeader className="pb-0">
					<CardTitle className="text-xl font-black">{year}</CardTitle>
				</CardHeader>
			)}

			<CardContent className="flex items-end gap-2">
				{podium.map((entry) => {
					const isWinner = entry.type === 1
					const medalColor = getMedalColorHex(entry.type)
					const initials = [entry.first_name, entry.last_name]
						.filter(Boolean)
						.map((n) => n![0])
						.join('')
						.toUpperCase()

					return (
						<div
							key={entry.id}
							className="flex flex-1 flex-col items-center gap-2 rounded-lg border p-3 text-center"
							style={
								isWinner
									? {
											borderColor: colors.gold,
											boxShadow: `0 0 18px 2px ${colors.gold}40`
										}
									: { borderColor: `${medalColor}50` }
							}
						>
							<Star
								className={cn('shrink-0', isWinner ? 'size-6' : 'size-4')}
								fill={medalColor}
								stroke={medalColor}
							/>

							<div
								className={cn(
									'flex items-center justify-center rounded-full border-2 bg-white/10 font-bold',
									isWinner ? 'size-16 text-base' : 'size-12 text-sm'
								)}
								style={{ borderColor: medalColor, color: medalColor }}
							>
								{initials}
							</div>

							<div className="flex flex-1 flex-col items-center">
								<Link
									href={`/users/${entry.user_id}`}
									className={cn(
										'leading-tight font-bold',
										isWinner ? 'text-sm' : 'text-xs',
										entry.user_id === viewerId && 'text-orange-400'
									)}
								>
									{entry.first_name} {entry.last_name}
								</Link>

								<span
									className={cn('mt-auto', isWinner ? 'text-sm' : 'text-xs')}
								>
									<span className="font-bold tabular-nums">{entry.points}</span>{' '}
									<span className="text-muted-foreground text-xs">pts</span>
								</span>
							</div>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}
