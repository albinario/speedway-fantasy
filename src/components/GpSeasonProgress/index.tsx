import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getGps } from '@/app/gps/data'
import { Flag } from '@/components/Flag'
import { Card, CardContent, CardGlow } from '@/components/ui/card'
import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'
import { cn } from '@/lib/utils'

type TGpSeasonProgress = {
	// Defaults to the current season (home page)
	year?: number
	// On a GP page: highlight that GP and link to its neighbours
	currentGpId?: number
}

export async function GpSeasonProgress({
	year = new Date().getFullYear(),
	currentGpId
}: TGpSeasonProgress) {
	const [gps, t] = await Promise.all([getGps(year), getTranslations('Home')])
	if (!gps.length) return null

	const currentIndex = gps.findIndex((gp) => gp.id === currentGpId)
	const previousGp = currentIndex > 0 ? gps[currentIndex - 1] : undefined
	const nextGp = currentIndex >= 0 ? gps[currentIndex + 1] : undefined

	return (
		<Card className="relative isolate">
			<CardGlow color="green" />
			<CardContent className="flex flex-col gap-3 pt-4">
				<span className="text-xs font-bold tracking-wide uppercase">
					{currentGpId ? t('seasonYear', { year }) : t('seasonProgress')}
				</span>

				<div className="flex items-start">
					{gps.map((gp, i) => {
						const stage = getMacroStage(gp.start_date, gp.finished)
						const isDone = stage === EMacroStage.After
						const isLive = stage === EMacroStage.During
						const isFirst = i === 0
						const isLast = i === gps.length - 1
						const isCurrent = gp.id === currentGpId

						return (
							<div
								key={gp.id}
								className="flex flex-1 flex-col items-center gap-1.5"
							>
								<span
									className={cn(
										'text-[10px] leading-none tabular-nums',
										isDone ? 'text-foreground' : 'text-muted-foreground/40',
										isCurrent && 'text-foreground font-black'
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
														: 'bg-white/20',
												isCurrent &&
													'ring-offset-card ring-2 ring-green-400 ring-offset-2'
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

				{(previousGp || nextGp) && (
					<div className="flex justify-between gap-2 text-sm">
						{previousGp ? (
							<Link
								className="text-muted-foreground hover:text-foreground flex min-w-0 items-center gap-1"
								href={`/gps/${previousGp.id}`}
							>
								<ChevronLeft className="text-brand-red size-4 shrink-0" />
								<span className="truncate">{previousGp.city_name}</span>
							</Link>
						) : (
							<span />
						)}

						{nextGp && (
							<Link
								className="text-muted-foreground hover:text-foreground flex min-w-0 items-center gap-1"
								href={`/gps/${nextGp.id}`}
							>
								<span className="truncate">{nextGp.city_name}</span>
								<ChevronRight className="text-brand-red size-4 shrink-0" />
							</Link>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
