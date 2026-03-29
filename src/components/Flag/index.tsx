import { hasFlag } from 'country-flag-icons'
import * as Flags from 'country-flag-icons/react/3x2'

type TFlag = {
	countryCode?: string | null
	title?: string
	className?: string
}

export function Flag({ countryCode, title, className = 'w-6 h-auto' }: TFlag) {
	if (!countryCode || !hasFlag(countryCode)) return null

	const Flag = Flags[countryCode as keyof typeof Flags]

	return <Flag className={className} title={title ?? countryCode} />
}
