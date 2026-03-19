const locale = 'en-GB'

export function formatDate(
	date?: Date | string | number | null,
	timeZone = 'UTC'
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
