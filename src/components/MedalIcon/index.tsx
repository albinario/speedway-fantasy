import { MedalIcon as MedalIconComponent } from 'lucide-react'

import { EMedal } from '@/enums'
import { cn } from '@/lib/utils'

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
			className={cn('size-4', `text-[${medalColor}]`, 'mx-auto')}
		/>
	)
}
