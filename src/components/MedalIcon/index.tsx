import { Trophy } from 'lucide-react'

import { getMedalColorHex } from '@/lib/medals'
import { cn } from '@/lib/utils'

type TMedalIcon = {
	type: number
	className?: string
}

export function MedalIcon({ type, className }: TMedalIcon) {
	return (
		<Trophy
			className={cn('size-3', className)}
			stroke={getMedalColorHex(type)}
			fill="none"
		/>
	)
}
