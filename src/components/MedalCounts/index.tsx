import { MedalIcon } from '@/components/MedalIcon'

type TMedalCounts = {
	medal_1?: number | null
	medal_2?: number | null
	medal_3?: number | null
	size?: 'default' | 'lg'
}

export function MedalCounts({
	medal_1,
	medal_2,
	medal_3,
	size = 'default'
}: TMedalCounts) {
	const counts = { 1: medal_1, 2: medal_2, 3: medal_3 } as const
	const countClass = size === 'lg' ? 'text-2xl' : 'text-sm '

	return (
		<div className={`flex w-fit items-center gap-${size === 'lg' ? '4' : '3'}`}>
			{([1, 2, 3] as const).map((type) => {
				const count = counts[type] ?? 0
				if (!count) return null

				return (
					<span key={type} className="inline-flex items-center gap-1">
						<MedalIcon type={type} size={size} />
						<span className={countClass}>{count}</span>
					</span>
				)
			})}
		</div>
	)
}
