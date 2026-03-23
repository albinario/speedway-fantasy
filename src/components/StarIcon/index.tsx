import { StarIcon as StarIconComponent } from 'lucide-react'

import { colors } from '@/config/brand'

type TStarIcon = {
	type: number
}

export function StarIcon({ type }: TStarIcon) {
	const medalColor =
		type === 1 ? colors.gold : type === 2 ? colors.silver : colors.bronze

	return (
		<StarIconComponent
			className="mx-auto size-4"
			stroke={medalColor}
			fill={medalColor}
		/>
	)
}
