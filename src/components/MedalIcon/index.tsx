import { Trophy } from 'lucide-react'

import { getMedalColorHex } from '@/lib/medals'

type TMedalIcon = {
	type: number
	size?: 'default' | 'lg'
}

export function MedalIcon({ type, size = 'default' }: TMedalIcon) {
	return (
		<Trophy
			className={size === 'lg' ? 'size-6' : 'size-4'}
			stroke={getMedalColorHex(type)}
			fill="none"
		/>
	)
}
