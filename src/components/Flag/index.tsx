import { hasFlag } from 'country-flag-icons'
import * as Flags from 'country-flag-icons/react/3x2'

import { cn } from '@/lib/utils'

type TFlag = {
	className?: string
	countryCode?: string | null
	title?: string
}

export function Flag({ className, countryCode, title }: TFlag) {
	if (!countryCode || !hasFlag(countryCode)) return null

	const Flag = Flags[countryCode as keyof typeof Flags]

	return (
		<Flag
			className={cn('h-auto w-6', className)}
			title={title ?? countryCode}
		/>
	)
}
