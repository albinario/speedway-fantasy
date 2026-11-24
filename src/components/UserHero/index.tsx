import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react'

import { MedalCounts } from '@/components/MedalCounts'
import { UserPositionProgress } from '@/components/PositionProgress'
import { getUsersProgress } from '@/components/PositionProgress/data'
import { SectionTitle } from '@/components/SectionHeader'
import { CardGlow } from '@/components/ui/card'
import { getUserStandingRow } from '@/components/UsersStandings/data'
import { type TParamValues } from '@/lib/params'
import { cn } from '@/lib/utils'

import { getLeader } from './data'

type TUserHero = {
	userId: number
	year: number | TParamValues
}

// Small section header above a stat value
function StatLabel({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-muted-foreground text-xs font-black tracking-wide uppercase">
			{children}
		</span>
	)
}

export async function UserHero({ userId, year }: TUserHero) {
	const [standings, leaderRecord, progress, t, tCommon, tProgress] =
		await Promise.all([
			getUserStandingRow(year, userId),
			getLeader(year),
			typeof year === 'number' ? getUsersProgress(year) : null,
			getTranslations('UserHero'),
			getTranslations('Common'),
			getTranslations('PositionProgress')
		])

	const pos = standings?.pos ?? null
	const prevPos = standings?.prev_pos ?? null
	const points = Number(standings?.points ?? 0)
	const leader = Number(leaderRecord?.points ?? points)
	const leaderUserId = leaderRecord?.userId ?? null
	const medals = {
		gold: Number(standings?.medal_1 ?? 0),
		silver: Number(standings?.medal_2 ?? 0),
		bronze: Number(standings?.medal_3 ?? 0)
	}

	const linksToLeader = leaderUserId != null && leaderUserId !== userId
	// Positive = climbed (lower position number is better)
	const moved = pos != null && prevPos != null ? prevPos - pos : 0

	// Same condition as the chart, so best/worst only show alongside it
	const positions = progress?.byUser[userId] ?? []
	const positionStats =
		positions.length >= 2
			? [
					{ label: tProgress('best'), value: Math.min(...positions) },
					{ label: tProgress('worst'), value: Math.max(...positions) }
				]
			: []

	return (
		<section className="flex flex-col gap-1">
			<SectionTitle>
				{typeof year === 'number' ? t('seasonYear', { year }) : t('allTime')}
			</SectionTitle>

			<div className="bg-card relative isolate flex flex-col divide-y divide-white/5 overflow-hidden rounded-xl">
				<CardGlow color="orange" position="top" />

				{/* Row 1: Points + medals | gap to leader. Medals wrap below the
				    points only when they collide; the gap always stays beside points */}
				<div className="flex items-start gap-4 p-4">
					<div className="flex min-w-0 flex-1 flex-wrap items-end gap-4">
						<div className="flex flex-col gap-1">
							<StatLabel>{tCommon('points')}</StatLabel>
							<span className="text-5xl leading-none font-black">{points}</span>
						</div>

						<MedalCounts
							medal_1={medals.gold}
							medal_2={medals.silver}
							medal_3={medals.bronze}
							size="lg"
						/>
					</div>

					{/* Leader points, styled like best/worst below.
					    pt-5 skips the POINTS label row, then a line box the size of the
					    points number gives the same baseline. An inline-block's baseline
					    is its last line (the value), so the stack sits on that baseline
					    with the label right above. (Not inline-flex + baseline-source:
					    Safari ignores baseline-source.) text-xl leading-none resets the
					    inherited 5xl line height inside the stack */}
					<div className="shrink-0 pt-5 text-5xl leading-none">
						<span className="inline-block text-right text-xl leading-none">
							<span className="block text-xs">
								<StatLabel>{t('leader')}</StatLabel>
							</span>

							{linksToLeader ? (
								<Link
									className="inline-flex items-center gap-1 font-black"
									href={`/users/${leaderUserId}${year !== 'all' ? `?year=${year}` : ''}`}
								>
									{leader}
									{/* Negative margin trims the icon's built-in whitespace */}
									<ChevronRight className="text-brand-red -mr-1.5" size={18} />
								</Link>
							) : (
								<span className="font-black">{leader}</span>
							)}
						</span>
					</div>
				</div>

				{/* Row 2: Position + movement + position after each GP */}
				{pos != null && (
					<div className="flex flex-col gap-4 p-4">
						<div className="flex items-end justify-between gap-4">
							<div className="flex flex-col gap-1">
								<StatLabel>{tCommon('position')}</StatLabel>

								<div className="flex items-baseline gap-2">
									<span className="text-4xl leading-none font-black">
										{pos}
									</span>

									{moved !== 0 && (
										<span
											className={
												moved > 0
													? 'flex items-center gap-0.5 text-base font-black text-green-400'
													: 'flex items-center gap-0.5 text-base font-black text-red-500'
											}
										>
											{moved > 0 ? (
												<ArrowUp size={16} />
											) : (
												<ArrowDown size={16} />
											)}
											{Math.abs(moved)}
										</span>
									)}
								</div>
							</div>

							{positionStats.length > 0 && (
								<dl className="flex gap-6">
									{positionStats.map(({ label, value }, i) => (
										<div
											key={label}
											className={cn(
												'flex flex-col',
												i === 0 ? 'items-center' : 'items-end'
											)}
										>
											<dt>
												<StatLabel>{label}</StatLabel>
											</dt>
											<dd className="text-xl leading-none font-black">
												{value}
											</dd>
										</div>
									))}
								</dl>
							)}
						</div>

						<UserPositionProgress userId={userId} year={year} />
					</div>
				)}
			</div>
		</section>
	)
}
