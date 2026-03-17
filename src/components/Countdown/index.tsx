'use client'

import { useEffect, useState } from 'react'

import { Badge } from '../ui/badge'

type TCountdown = {
	startDate: Date
}

const getCountdownLabel = (startDate: Date) => {
	const diffMs = startDate.getTime() - Date.now()

	if (diffMs <= 0) return 'Live now'

	const totalSeconds = Math.floor(diffMs / 1000)
	const days = Math.floor(totalSeconds / 86400)
	const hours = Math.floor((totalSeconds % 86400) / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export function Countdown({ startDate }: TCountdown) {
	const [label, setLabel] = useState(() => getCountdownLabel(startDate))

	useEffect(() => {
		const interval = setInterval(
			() => setLabel(getCountdownLabel(startDate)),
			1000,
		)

		return () => clearInterval(interval)
	}, [startDate])

	return (
		<Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
			{label}
		</Badge>
	)
}
