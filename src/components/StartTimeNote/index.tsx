'use client'

import { locale } from '@/config/time-zone'

type TStartTimeNote = {
	date?: string | number | Date | null
	eventTimeZone?: string | null
}

function getTimeZoneOffsetLabel(date: Date, timeZone: string) {
	return new Intl.DateTimeFormat(locale, {
		timeZone,
		timeZoneName: 'shortOffset'
	})
		.formatToParts(date)
		.find((part) => part.type === 'timeZoneName')?.value
}

export function StartTimeNote({ date, eventTimeZone }: TStartTimeNote) {
	if (!date || !eventTimeZone) return null

	const eventDate = new Date(date)
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	const userOffset = getTimeZoneOffsetLabel(eventDate, userTimeZone)
	const eventOffset = getTimeZoneOffsetLabel(eventDate, eventTimeZone)

	if (!userOffset || !eventOffset || userOffset === eventOffset) {
		return null
	}

	const userTime = eventDate.toLocaleTimeString(locale, {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	})

	return (
		<span className="text-yellow-400">
			<br />
			Where you are {userTime}
		</span>
	)
}
