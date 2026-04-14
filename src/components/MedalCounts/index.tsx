import { MedalIcon } from '@/components/MedalIcon'
import { getMedalColorStr } from '@/lib/medals'

type TMedalCounts = {
	medal_1?: number | null
	medal_2?: number | null
	medal_3?: number | null
}

export function MedalCounts({ medal_1, medal_2, medal_3 }: TMedalCounts) {
	const counts = { 1: medal_1, 2: medal_2, 3: medal_3 } as const

	return (
		<div className="flex w-fit items-center gap-2">
			{([1, 2, 3] as const).map((type) => {
				const count = counts[type]
				if (!count) return null

				return (
					<span
						key={type}
						className={`inline-flex items-center gap-1 ${getMedalColorStr(type, 'text')}`}
					>
						{count}
						<MedalIcon type={type} />
					</span>
				)
			})}
		</div>
	)
}
