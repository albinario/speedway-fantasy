import { MedalIcon as MedalIconComponent } from 'lucide-react'

import { EMedal } from '@/enums'

type TMedalIcon = {
	medal: EMedal
}

export function MedalIcon({ medal }: TMedalIcon) {
	const medalColor =
		medal === EMedal.Gold
			? '#FFD700'
			: medal === EMedal.Silver
				? '#C0C0C0'
				: '#CD7F32'

	return (
		<MedalIconComponent
			className="mx-auto size-4"
			style={{ stroke: medalColor }}
		/>
	)
}
