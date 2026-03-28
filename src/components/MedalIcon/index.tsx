import { MedalIcon as MedalIconComponent } from 'lucide-react'

import { getMedalColor } from '@/lib/medals'

type TMedalIcon = {
	type: number
}

export function MedalIcon({ type }: TMedalIcon) {
	return (
		<MedalIconComponent
			className="mx-auto size-4"
			stroke={getMedalColor(type)}
		/>
	)
}
