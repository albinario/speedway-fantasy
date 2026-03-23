import { MedalIcon as MedalIconComponent } from 'lucide-react'

import { colors } from '@/config/brand'
import { EMedal } from '@/enums'

type TMedalIcon = {
	medal: EMedal
}

export function MedalIcon({ medal }: TMedalIcon) {
	const medalColor =
		medal === EMedal.Gold
			? colors.gold
			: medal === EMedal.Silver
				? colors.silver
				: colors.bronze

	return <MedalIconComponent className="mx-auto size-4" stroke={medalColor} />
}
