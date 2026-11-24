import { getTranslations } from 'next-intl/server'

import { getGps } from '@/app/gps/data'
import { Flag } from '@/components/Flag'
import { gpCardAnchor } from '@/components/GpCard/anchor'
import type { TParamValues } from '@/lib/params'
import { cn } from '@/lib/utils'

import { getUsersProgress } from './data'
import { positionPoints } from './geometry'

type TUserPositionProgress = {
	userId: number
	year: number | TParamValues
}

const pct = (fraction: number) => `${fraction * 100}%`

export async function UserPositionProgress({
	userId,
	year
}: TUserPositionProgress) {
	if (typeof year !== 'number') return null

	const [progress, gps, t, tCommon] = await Promise.all([
		getUsersProgress(year),
		getGps(year),
		getTranslations('PositionProgress'),
		getTranslations('Common')
	])

	const positions = progress?.byUser[userId]
	if (!progress || !positions || positions.length < 2) return null

	const length = positions.length

	// Label the best and worst dots instead of a y-axis. On ties, the most
	// recent occurrence gets the label; a flat line only gets one label
	const best = Math.min(...positions)
	const worst = Math.max(...positions)
	const bestIndex = positions.lastIndexOf(best)
	const worstIndex = best === worst ? -1 : positions.lastIndexOf(worst)

	// Positions are appended once per GP final, so they line up with the
	// latest finished GPs (a late joiner simply has fewer of them)
	const finished = gps.filter((gp) => gp.finished)
	const gpsForPositions =
		finished.length >= length ? finished.slice(-length) : null

	const points = positionPoints(positions, length).map((point, i) => {
		const gp = gpsForPositions?.[i]
		return {
			...point,
			round: gp?.round ?? i + 1,
			city: gp?.city_name ?? null,
			gpId: gp?.id ?? null,
			countryCode: gp?.country_code ?? null
		}
	})

	return (
		<div className="flex flex-col gap-2">
			{/* my-6 leaves room for the best/worst labels above and below */}
			<div
				role="img"
				aria-label={t('chartLabel', {
					positions: positions.join(', ')
				})}
				className="relative mx-2 my-6 h-40"
			>
				<svg
					aria-hidden
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					className="absolute inset-0 size-full overflow-visible"
				>
					{[0, 100].map((y) => (
						<line
							key={y}
							x1={0}
							x2={100}
							y1={y}
							y2={y}
							className="stroke-foreground/10"
							strokeDasharray="4 4"
							vectorEffect="non-scaling-stroke"
						/>
					))}
					<polyline
						points={points.map(({ x, y }) => `${x * 100},${y * 100}`).join(' ')}
						fill="none"
						className="stroke-orange-400"
						strokeWidth={2.5}
						strokeLinejoin="round"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>

				{/* Dots are HTML so they stay round while the SVG stretches. Like the
				    flags, each jumps to its GP card; before: widens the tap target */}
				{points.map(({ pos, round, city, gpId, x, y }, i) => {
					const isLatest = i === points.length - 1
					const title = [city, t('dotLabel', { round, pos })]
						.filter(Boolean)
						.join(' · ')
					const className = cn(
						'ring-card absolute -translate-1/2 rounded-full ring-2',
						isLatest ? 'size-3.5 bg-orange-400' : 'size-2.5 bg-orange-400/80'
					)
					const style = { left: pct(x), top: pct(y) }

					return gpId ? (
						<a
							key={i}
							href={`#${gpCardAnchor(gpId)}`}
							title={title}
							className={cn(
								className,
								'transition-transform before:absolute before:-inset-2 before:content-[""] hover:scale-125'
							)}
							style={style}
						/>
					) : (
						<span key={i} title={title} className={className} style={style} />
					)
				})}

				{/* Best above its dot, worst below its dot */}
				{points.map(({ pos, x, y }, i) =>
					i === bestIndex || i === worstIndex ? (
						<span
							key={`label-${i}`}
							aria-hidden
							className={cn(
								'pointer-events-none absolute -translate-x-1/2 text-xs leading-none font-black',
								i === bestIndex ? '-translate-y-full pb-2.5' : 'pt-2.5'
							)}
							style={{ left: pct(x), top: pct(y) }}
						>
							{pos}
						</span>
					) : null
				)}
			</div>

			{/* x-axis: GP flags that jump to the GP card further down the page */}
			<div className="text-muted-foreground relative mx-2 h-4 text-xs">
				{points.map(({ round, city, gpId, countryCode, x }) => (
					<span
						key={round}
						className="absolute -translate-x-1/2"
						style={{ left: pct(x) }}
					>
						{gpId && countryCode ? (
							<a
								href={`#${gpCardAnchor(gpId)}`}
								title={[city, tCommon('round', { round })]
									.filter(Boolean)
									.join(' · ')}
								className="block rounded-xs transition-opacity hover:opacity-70"
							>
								<Flag countryCode={countryCode} className="w-4" />
							</a>
						) : (
							round
						)}
					</span>
				))}
			</div>
		</div>
	)
}
