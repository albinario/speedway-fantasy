import { MedalIcon } from '@/components/MedalIcon'
import { cn } from '@/lib/utils'

type TMedalCounts = {
	medal_1?: number | null
	medal_2?: number | null
	medal_3?: number | null
	size: 'sm' | 'lg'
}

const sizeClasses = {
	sm: { wrapper: 'gap-3 text-xs', icon: 'size-3' },
	lg: {
		wrapper: 'gap-3 text-lg sm:gap-4 sm:text-2xl',
		icon: 'size-4.5 sm:size-6'
	}
} as const

export function MedalCounts({ medal_1, medal_2, medal_3, size }: TMedalCounts) {
	const counts = { 1: medal_1, 2: medal_2, 3: medal_3 } as const
	const classes = sizeClasses[size]

	return (
		<div className={cn('flex w-fit items-center', classes.wrapper)}>
			{([1, 2, 3] as const).map((type) => {
				const count = counts[type] ?? 0
				if (!count) return null

				return (
					<span key={type} className="inline-flex items-center gap-1">
						<MedalIcon type={type} className={classes.icon} />
						<span>{count}</span>
					</span>
				)
			})}
		</div>
	)
}
