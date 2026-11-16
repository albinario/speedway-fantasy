import { cn } from '@/lib/utils'

import { positionPoints } from './geometry'

const W = 64
const H = 24
const PAD = 3

type TPositionSparkline = {
	positions: number[]
	rounds: number
	className?: string
}

// Pure SVG so it renders in both server and client components
export function PositionSparkline({
	positions,
	rounds,
	className
}: TPositionSparkline) {
	if (positions.length < 2) return null

	const coords = positionPoints(positions, rounds).map(({ x, y }) => ({
		x: PAD + x * (W - 2 * PAD),
		y: PAD + y * (H - 2 * PAD)
	}))
	const last = coords[coords.length - 1]
	const latest = positions[positions.length - 1]
	const previous = positions[positions.length - 2]

	return (
		<svg
			aria-hidden
			viewBox={`0 0 ${W} ${H}`}
			width={W}
			height={H}
			className={cn(
				'shrink-0',
				latest < previous
					? 'text-green-400'
					: latest > previous
						? 'text-red-500'
						: 'text-muted-foreground',
				className
			)}
		>
			<polyline
				points={coords.map(({ x, y }) => `${x},${y}`).join(' ')}
				fill="none"
				stroke="currentColor"
				strokeOpacity={0.6}
				strokeWidth={1.5}
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
			<circle cx={last.x} cy={last.y} r={2.5} fill="currentColor" />
		</svg>
	)
}
