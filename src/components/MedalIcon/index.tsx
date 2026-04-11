import { MedalIcon as MedalIconComponent } from 'lucide-react'

import { getMedalColorHex } from '@/lib/medals'

type TMedalIcon = {
	type: number
}

export function MedalIcon({ type }: TMedalIcon) {
	return (
		<MedalIconComponent className="size-4" stroke={getMedalColorHex(type)} />
	)
}
