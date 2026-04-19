import { hasFlag } from 'country-flag-icons'
import * as Flags from 'country-flag-icons/react/3x2'

import { cn } from '@/lib/utils'

type TFlag = {
	countryCode?: string | null
	title?: string
	widthClass?: string
}

export function Flag({ countryCode, title, widthClass = 'w-6' }: TFlag) {
	if (!countryCode || !hasFlag(countryCode)) return null

	const Flag = Flags[countryCode as keyof typeof Flags]

	return (
		<Flag className={cn('h-auto', widthClass)} title={title ?? countryCode} />
	)
}
