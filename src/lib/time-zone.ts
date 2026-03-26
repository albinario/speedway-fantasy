import { defaultTimeZone, locale } from '@/config/time-zone'

const getTimeZoneOffsetLabel = (date: Date, timeZone: string) => {
	return new Intl.DateTimeFormat(locale, {
		timeZone,
		timeZoneName: 'shortOffset'
	})
		.formatToParts(date)
		.find((part) => part.type === 'timeZoneName')?.value
}

export function getTimeZoneDiff(eventDate: Date, timeZone = defaultTimeZone) {
	const serverTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	const serverOffset = eventDate
		? getTimeZoneOffsetLabel(eventDate, serverTimeZone)
		: null

	const gpOffset =
		eventDate && timeZone ? getTimeZoneOffsetLabel(eventDate, timeZone) : null

	return Boolean(serverOffset && gpOffset) && serverOffset !== gpOffset
}
