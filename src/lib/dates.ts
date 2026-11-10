import { defaultTimeZone } from '@/config/time-zone'
import { EMacroStage } from '@/enums'
import { defaultLocale, intlLocales } from '@/i18n/config'

export function formatDate(
	date?: Date | string | number | null,
	timeZone = defaultTimeZone,
	locale = intlLocales[defaultLocale]
) {
	if (!date) return null

	const d = new Date(date)

	const datePart = d.toLocaleDateString(locale, {
		day: 'numeric',
		month: 'long'
	})

	const timePart = d.toLocaleTimeString(locale, {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone
	})

	return `${datePart} ${timePart}`
}

export function getMacroStage(
	startDate: Date | string | null | undefined,
	finished: boolean | null | undefined
): EMacroStage {
	if (finished) return EMacroStage.After
	if (startDate && new Date(startDate) <= new Date()) return EMacroStage.During
	return EMacroStage.Before
}
