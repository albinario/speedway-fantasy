import Link from 'next/link'

import { ChevronRight, Sparkles } from 'lucide-react'

import { FlagNumber } from '@/components/FlagNumber'
import { getUserGpRow } from '@/components/GpCard/UserResultRow/data'
import { PosBadge } from '@/components/PosBadge'
import { RiderName } from '@/components/RiderName'
import { Card, CardContent, CardGlow } from '@/components/ui/card'
import { UserName } from '@/components/UserName'

import { getGpVenueHistory } from './data'

type TVenueHistory = {
	gpId: number
	cityName: string
	viewerId?: number
}

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
			{children}
		</span>
	)
}

function Points({ points }: { points: number | null }) {
	return (
		<span className="shrink-0 text-sm">
			<span className="font-bold tabular-nums">{points ?? 0}</span>{' '}
			<span className="text-muted-foreground text-xs">pts</span>
		</span>
	)
}

export async function VenueHistory({
	gpId,
	cityName,
	viewerId
}: TVenueHistory) {
	const history = await getGpVenueHistory(gpId)

	// Query failed: show nothing rather than wrongly claiming a first visit
	if (history === undefined) return null

	if (history === null) {
		return (
			<Card className="relative isolate">
				<CardGlow color="gold" />
				<CardContent className="flex items-center gap-3 pt-4">
					<Sparkles className="text-gold size-5 shrink-0" />
					<div className="flex flex-col">
						<span className="font-black uppercase">First GP in {cityName}</span>
						<span className="text-muted-foreground text-sm">
							No previous results at this venue.
						</span>
					</div>
				</CardContent>
			</Card>
		)
	}

	const { rider, bestPos } = history
	let { players, morePlayers } = history

	// The viewer's own result that GP, unless they're already listed as best
	const viewerRow =
		viewerId != null ? await getUserGpRow(history.gpId, viewerId) : null
	const viewerIsBest = viewerRow != null && viewerRow.pos === bestPos
	const viewerListed = players.some((p) => p.user_id === viewerId)

	// Tied for best but hidden behind "+N more": show them in the list instead
	if (viewerRow && viewerIsBest && !viewerListed) {
		players = [...players, viewerRow]
		morePlayers = Math.max(0, morePlayers - 1)
	}

	return (
		<Card className="relative isolate">
			<CardGlow color="gold" />
			<CardContent className="flex flex-col gap-4 pt-4">
				<div className="flex items-baseline justify-between gap-2">
					<span className="text-xs font-bold tracking-wide uppercase">
						Last time in {cityName}{' '}
						<span className="text-muted-foreground">{history.year}</span>
					</span>

					<Link
						className="text-brand-red flex shrink-0 items-center text-sm"
						href={`/gps/${history.gpId}`}
					>
						View GP <ChevronRight className="size-4" />
					</Link>
				</div>

				{rider && (
					<div className="flex flex-col gap-1">
						<Label>Best rider</Label>
						<div className="flex items-center justify-between gap-2">
							<div className="flex min-w-0 items-center gap-2">
								<RiderName name={rider.name} riderId={rider.rider_id} />
								<FlagNumber
									countryCode={rider.country_code}
									number={rider.number}
								/>
							</div>
							<Points points={rider.points} />
						</div>
					</div>
				)}

				{players.length > 0 && (
					<div className="flex flex-col gap-1">
						<Label>{players.length > 1 ? 'Best players' : 'Best player'}</Label>
						<div className="flex items-start justify-between gap-2">
							<div className="flex min-w-0 flex-col gap-1">
								{players.map((player) => (
									<UserName
										key={player.user_id}
										firstName={player.first_name}
										lastName={player.last_name}
										isViewer={player.user_id === viewerId}
										stars={player.stars}
										userId={player.user_id}
									/>
								))}
								{morePlayers > 0 && (
									<span className="text-muted-foreground text-xs">
										+{morePlayers} more
									</span>
								)}
							</div>
							<Points points={players[0].points} />
						</div>
					</div>
				)}

				{viewerRow && !viewerIsBest && (
					<div className="flex flex-col gap-1">
						<Label>You</Label>
						<div className="flex items-center justify-between gap-2">
							<div className="flex min-w-0 items-center gap-2">
								<PosBadge pos={viewerRow.pos} />
								<UserName
									firstName={viewerRow.first_name}
									lastName={viewerRow.last_name}
									isViewer
									stars={viewerRow.stars}
									userId={viewerRow.user_id}
								/>
							</div>
							<Points points={viewerRow.points} />
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
