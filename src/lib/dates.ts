const locale = 'sv-SE'

export function formatDate(date?: Date | string | number | null) {
	if (!date) return null

	return new Date(date).toLocaleString(locale, {
		dateStyle: 'short',
		timeStyle: 'short',
	})
}
