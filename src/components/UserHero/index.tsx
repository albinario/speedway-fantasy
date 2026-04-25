import Link from 'next/link'

import {
	ArrowDown,
	ArrowUp,
	ChevronRight,
	Flame,
	ShieldOff,
	Trophy
} from 'lucide-react'

import { getUserStars } from '@/app/users/[id]/data'
import { MedalCounts } from '@/components/MedalCounts'
import { getUserStandingRow } from '@/components/UsersStandings/data'
import { getMedalColorHex } from '@/lib/medals'
import { type TParamValues } from '@/lib/params'

import { getLeader, getUserStreak } from './data'

type TUserHero = {
	userId: number
	year: number | TParamValues
}

export async function UserHero({ userId, year }: TUserHero) {
	const [standings, leaderRecord, streak, starRecords] = await Promise.all([
		getUserStandingRow(year, userId),
		getLeader(year),
		getUserStreak(userId),
		getUserStars(userId)
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

	const moved = pos != null && prevPos != null ? prevPos - pos : null
	const gap = leader - points
	const progressPct =
		leader > 0 ? Math.min(100, Math.round((points / leader) * 100)) : 100

	return (
		<div className="flex flex-col gap-1">
			<div className="bg-card flex flex-col divide-y divide-white/5 rounded-xl">
				{/* Row 1: Points + medals + streak */}
				<div className="flex flex-wrap items-center gap-6 p-4">
					<div className="flex flex-col items-center">
						<span className="text-5xl leading-none font-black">{points}</span>
						<span className="text-muted-foreground text-xs font-black tracking-wide uppercase">
							Points
						</span>
					</div>

					<MedalCounts
						medal_1={medals.gold}
						medal_2={medals.silver}
						medal_3={medals.bronze}
						size="lg"
					/>

					{streak > 0 && (
						<div className="ml-auto flex items-center gap-1.5">
							<span className="text-xl font-black">{streak}</span>
							<Flame size={25} className="text-brand-red" />
							<span className="text-muted-foreground text-xs tracking-wide uppercase">
								GP Streak
							</span>
						</div>
					)}
				</div>

				{/* Row 2: Position + progress bar */}
				{pos != null && (
					<div className="flex flex-col gap-2 p-4">
						<div className="flex items-baseline justify-between">
							<div className="flex items-center gap-2">
								<span className="text-2xl font-black">
									#<span className="text-4xl">{pos}</span>
								</span>

								{moved != null && moved > 0 && (
									<span className="flex items-center gap-0.5 rounded-full bg-green-400/20 px-2 py-0.5 text-xs font-black text-green-400">
										<ArrowUp size={12} />
										{moved} pos
									</span>
								)}
								{moved != null && moved < 0 && (
									<span className="flex items-center gap-0.5 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-black text-red-500">
										<ArrowDown size={12} /> {Math.abs(moved)} pos
									</span>
								)}
							</div>

							<span className="tracking-wide uppercase">
								<span className="text-brand-red">{gap} pts</span>{' '}
								{leaderUserId != null && leaderUserId !== userId ? (
									<Link
										className="text-muted-foreground inline-flex items-center text-xs hover:underline"
										href={`/users/${leaderUserId}${year !== 'all' ? `?year=${year}` : ''}`}
									>
										behind leader
										<ChevronRight className="text-brand-red" size={16} />
									</Link>
								) : (
									<span className="text-muted-foreground text-xs">
										behind leader
									</span>
								)}
							</span>
						</div>

						{leader > 0 && (
							<>
								<div className="bg-foreground/10 h-4 overflow-hidden rounded-full">
									<div
										className="from-brand-red/60 to-brand-red h-full rounded-full bg-gradient-to-r"
										style={{ width: `${progressPct}%` }}
									/>
								</div>

								<div className="flex justify-between">
									<span className="text-xs font-black tracking-wide uppercase">
										You · {points} pts
									</span>
									<span className="text-xs font-black tracking-wide uppercase">
										#1 · {leader} pts
									</span>
								</div>
							</>
						)}
					</div>
				)}

				{/* Trophy collection */}
				<div className="flex flex-wrap items-start gap-x-6 gap-y-3 p-4">
					<span className="text-muted-foreground shrink-0 text-xs font-black tracking-wide uppercase">
						Trophy collection
					</span>

					{starRecords.length > 0 ? (
						<div className="flex flex-1 justify-end gap-4">
							{starRecords.map(({ year: starYear, type }) => {
								const color = getMedalColorHex(type)
								const label =
									type === 1 ? 'Winner' : type === 2 ? 'Second' : 'Third'

								return (
									<div key={starYear} className="flex items-center gap-2">
										<Trophy size={30} stroke={color} />

										<div className="flex flex-col leading-none">
											<span className="text-sm font-black">{label}</span>
											<span className="text-muted-foreground text-xs">
												{starYear}
											</span>
										</div>
									</div>
								)
							})}
						</div>
					) : (
						<ShieldOff
							size={15}
							className="text-muted-foreground ml-auto opacity-50"
						/>
					)}
				</div>
			</div>
		</div>
	)
}
