import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import type { TGpSummary } from '@/app/gps/[id]/data'
import { FlagNumber } from '@/components/FlagNumber'
import { getUserGpRow } from '@/components/GpCard/UserResultRow/data'
import { PosBadge } from '@/components/PosBadge'
import { RiderName } from '@/components/RiderName'
import { UserName } from '@/components/UserName'
import { cn } from '@/lib/utils'

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
			{children}
		</span>
	)
}

type TPoints = {
	points: number | null
	// Bigger and gold for the best results
	highlight?: boolean
}

function Points({ points, highlight = false }: TPoints) {
	const t = useTranslations('Common')

	return (
		<span className="shrink-0 text-sm">
			<span
				className={cn(
					'font-bold tabular-nums',
					highlight && 'text-gold text-lg font-black'
				)}
			>
				{points ?? 0}
			</span>{' '}
			<span className="text-muted-foreground text-xs">{t('pts')}</span>
		</span>
	)
}

type TGpResultSummaryBody = {
	summary: TGpSummary
	viewerId?: number
}

/** Best rider, best player(s) and the viewer's own result for one GP. */
export async function GpResultSummaryBody({
	summary,
	viewerId
}: TGpResultSummaryBody) {
	const t = await getTranslations('ResultSummary')
	const { rider, bestPos } = summary
	let { players, morePlayers } = summary

	// The viewer's own result that GP, unless they're already listed as best
	const viewerRow =
		viewerId != null ? await getUserGpRow(summary.gpId, viewerId) : null
	const viewerIsBest = viewerRow != null && viewerRow.pos === bestPos
	const viewerListed = players.some((p) => p.user_id === viewerId)

	// Tied for best but hidden behind "+N more": show them in the list instead
	if (viewerRow && viewerIsBest && !viewerListed) {
		players = [...players, viewerRow]
		morePlayers = Math.max(0, morePlayers - 1)
	}

	return (
		<>
			{rider && (
				<div className="flex flex-col gap-1">
					<Label>{t('bestRider')}</Label>
					<div className="flex items-center justify-between gap-2">
						<div className="flex min-w-0 items-center gap-2">
							<RiderName name={rider.name} riderId={rider.rider_id} />
							<FlagNumber
								countryCode={rider.country_code}
								number={rider.number}
							/>
						</div>
						<Points points={rider.points} highlight />
					</div>
				</div>
			)}

			{players.length > 0 && (
				<div className="flex flex-col gap-1">
					<Label>{t('bestPlayers', { count: players.length })}</Label>
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
									{t('more', { count: morePlayers })}
								</span>
							)}
						</div>
						<Points points={players[0].points} highlight />
					</div>
				</div>
			)}

			{viewerRow && !viewerIsBest && (
				<div className="flex flex-col gap-1">
					<Label>{t('you')}</Label>
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
		</>
	)
}
