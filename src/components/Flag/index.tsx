import { hasFlag } from 'country-flag-icons'
import * as Flags from 'country-flag-icons/react/3x2'

type TFlag = {
	countryCode?: string | null
	title?: string
	width?: number
}

export function Flag({ countryCode, title, width = 24 }: TFlag) {
	if (!countryCode || !hasFlag(countryCode)) return null

	const Flag = Flags[countryCode as keyof typeof Flags]

	return <Flag style={{ width }} title={title ?? countryCode} />
}
