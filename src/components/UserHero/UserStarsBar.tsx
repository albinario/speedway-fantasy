import { StarIcon } from 'lucide-react'

import { getMedalColorHex } from '@/lib/medals'

const LABEL: Record<number, string> = {
	1: 'Winner',
	2: 'Second',
	3: 'Third'
}

type TStar = {
	type: number
	year: number
}

type TUserStarsBar = {
	stars: TStar[]
}

export function UserStarsBar({ stars }: TUserStarsBar) {
	if (stars.length === 0) return null

	return (
		<div className="bg-card ring-foreground/10 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl p-4 ring-1">
			{stars.map(({ year, type }) => {
				const color = getMedalColorHex(type)
				return (
					<div key={year} className="flex items-center gap-2">
						<StarIcon className="size-5 shrink-0" fill={color} stroke={color} />
						<div className="flex flex-col leading-none">
							<span className="text-sm font-black">{LABEL[type]}</span>
							<span className="text-muted-foreground text-xs">{year}</span>
						</div>
					</div>
				)
			})}
		</div>
	)
}
