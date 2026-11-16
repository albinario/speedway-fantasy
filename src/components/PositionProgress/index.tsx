import { getTranslations } from 'next-intl/server'

import { getGps } from '@/app/gps/data'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import type { TParamValues } from '@/lib/params'

import { getUsersProgress } from './data'
import { positionPoints, positionRange } from './geometry'

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

	const [progress, gps, t] = await Promise.all([
		getUsersProgress(year),
		getGps(year),
		getTranslations('PositionProgress')
	])

	const positions = progress?.byUser[userId]
	if (!progress || !positions || positions.length < 2) return null

	const length = positions.length
	const { top, bottom } = positionRange(positions)

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
			city: gp?.city_name ?? null
		}
	})

	const best = Math.min(...positions)
	const worst = Math.max(...positions)
	const latest = points[points.length - 1]

	const stats = [
		{ label: t('best'), value: best },
		{ label: t('worst'), value: worst },
		{ label: t('latest'), value: latest.pos }
	]

	return (
		<section className="flex flex-col gap-1">
			<SectionTitle>{t('title')}</SectionTitle>

			<Card className="gap-4 p-4">
				<dl className="flex gap-6">
					{stats.map(({ label, value }) => (
						<div key={label} className="flex flex-col">
							<dt className="text-muted-foreground text-xs font-black tracking-wide uppercase">
								{label}
							</dt>
							<dd className="text-xl font-black">#{value}</dd>
						</div>
					))}
				</dl>

				<div
					role="img"
					aria-label={t('chartLabel', {
						positions: positions.join(', ')
					})}
					className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2"
				>
					{/* y-axis: best position on top */}
					<div className="text-muted-foreground relative h-40 w-5 text-right text-xs">
						<span className="absolute top-0 right-0 -translate-y-1/2">
							{top}
						</span>
						<span className="absolute right-0 bottom-0 translate-y-1/2">
							{bottom}
						</span>
					</div>

					<div className="relative mx-2 h-40">
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

						{/* Dots are HTML so they stay round while the SVG stretches */}
						{points.map(({ pos, round, city, x, y }, i) => {
							const isLatest = i === points.length - 1
							return (
								<span
									key={i}
									title={[city, t('dotLabel', { round, pos })]
										.filter(Boolean)
										.join(' · ')}
									className={
										isLatest
											? 'ring-card absolute size-3.5 -translate-1/2 rounded-full bg-orange-400 ring-2'
											: 'ring-card absolute size-2.5 -translate-1/2 rounded-full bg-orange-400/80 ring-2'
									}
									style={{ left: pct(x), top: pct(y) }}
								/>
							)
						})}
					</div>

					{/* x-axis: GP round numbers */}
					<span />
					<div className="text-muted-foreground relative mx-2 h-4 text-xs">
						{points.map(({ round, x }) => (
							<span
								key={round}
								className="absolute -translate-x-1/2"
								style={{ left: pct(x) }}
							>
								{round}
							</span>
						))}
					</div>
				</div>
			</Card>
		</section>
	)
}
