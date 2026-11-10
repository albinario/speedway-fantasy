'use client'

import { useLocale, useTranslations } from 'next-intl'

import { intlLocales } from '@/i18n/config'

type TStartTimeNote = {
	date?: string | number | Date | null
	eventTimeZone?: string | null
}

function getTimeZoneOffsetLabel(date: Date, timeZone: string) {
	return new Intl.DateTimeFormat('en-GB', {
		timeZone,
		timeZoneName: 'shortOffset'
	})
		.formatToParts(date)
		.find((part) => part.type === 'timeZoneName')?.value
}

export function StartTimeNote({ date, eventTimeZone }: TStartTimeNote) {
	const t = useTranslations('GpCard')
	const locale = intlLocales[useLocale()]

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
			{t('whereYouAre', { time: userTime })}
		</span>
	)
}
