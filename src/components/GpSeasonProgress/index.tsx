import Link from 'next/link'

import { getGps } from '@/app/gps/data'
import { Flag } from '@/components/Flag'
import { Card, CardContent } from '@/components/ui/card'
import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'
import type { TParamValues } from '@/lib/params'
import { cn } from '@/lib/utils'

type Props = { year: number | TParamValues }

export async function GpSeasonProgress({ year }: Props) {
	if (typeof year !== 'number') return null

	const gps = await getGps(year)
	if (!gps.length) return null

	const finished = gps.filter((gp) => gp.finished).length
	const total = gps.length

	return (
		<Card>
			<CardContent className="flex flex-col gap-3 pt-4">
				<div className="flex items-baseline justify-between">
					<span className="text-xs font-bold tracking-wide uppercase">
						Season progress
					</span>
					<span className="text-muted-foreground text-xs tabular-nums">
						{finished} of {total} GPs
					</span>
				</div>

				<div className="flex items-start">
					{gps.map((gp, i) => {
						const stage = getMacroStage(gp.start_date, gp.finished)
						const isDone = stage === EMacroStage.After
						const isLive = stage === EMacroStage.During
						const isFirst = i === 0
						const isLast = i === gps.length - 1

						return (
							<div
								key={gp.id}
								className="flex flex-1 flex-col items-center gap-1.5"
							>
								<span
									className={cn(
										'text-[10px] tabular-nums leading-none',
										isDone ? 'text-green-400' : 'text-muted-foreground/40'
									)}
								>
									{gp.round}
								</span>
								<div className="flex w-full items-center">
									<div
										className={cn(
											'h-px flex-1 bg-white/20',
											isFirst && 'opacity-0'
										)}
									/>
									<Link href={`/gps/${gp.id}`}>
										<div
											className={cn(
												'z-10 size-2.5 shrink-0 rounded-full',
												isDone
													? 'bg-green-400'
													: isLive
														? 'animate-pulse bg-yellow-400'
														: 'bg-white/20'
											)}
										/>
									</Link>
									<div
										className={cn(
											'h-px flex-1 bg-white/20',
											isLast && 'opacity-0'
										)}
									/>
								</div>
								<Link href={`/gps/${gp.id}`}>
									<Flag countryCode={gp.country_code} widthClass="w-3.5" />
								</Link>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}
