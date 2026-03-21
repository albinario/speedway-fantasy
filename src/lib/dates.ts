import { defaultTimeZone, locale } from '@/config/time-zone'

export function formatDate(
	date?: Date | string | number | null,
	timeZone = defaultTimeZone
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
