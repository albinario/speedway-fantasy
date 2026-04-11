'use client'

import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'

type TCountdown = {
	startDate: Date
}

type TCountdownParts = {
	days: number
	hours: number
	minutes: number
	seconds: number
}

function getCountdownParts(startDate: Date): TCountdownParts | null {
	const diffMs = startDate.getTime() - Date.now()
	if (diffMs <= 0) return null

	const totalSeconds = Math.floor(diffMs / 1000)
	const days = Math.floor(totalSeconds / 86400)
	const hours = Math.floor((totalSeconds % 86400) / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	return { days, hours, minutes, seconds }
}

function Segment({ value, label }: { value: number; label: string }) {
	return (
		<div className="flex flex-col items-center">
			<span className="text-base leading-none tabular-nums">
				{String(value).padStart(2, '0')}
			</span>
			<span className="text-[10px] font-normal opacity-60">{label}</span>
		</div>
	)
}

function Divider() {
	return <span className="mb-2 self-end text-sm opacity-40">:</span>
}

export function Countdown({ startDate }: TCountdown) {
	const [parts, setParts] = useState<TCountdownParts | null>(null)

	useEffect(() => {
		setParts(getCountdownParts(startDate))

		const interval = setInterval(() => {
			setParts(getCountdownParts(startDate))
		}, 1000)

		return () => clearInterval(interval)
	}, [startDate])

	if (!parts) return null

	const showSeconds = parts.days === 0 && parts.hours === 0

	return (
		<Badge variant="frosted" className="text-green-400">
			{parts.days > 0 && (
				<>
					<Segment value={parts.days} label="days" />
					<Divider />
				</>
			)}
			<Segment value={parts.hours} label="hrs" />
			<Divider />
			<Segment value={parts.minutes} label="min" />
			{showSeconds && (
				<>
					<Divider />
					<Segment value={parts.seconds} label="sec" />
				</>
			)}
		</Badge>
	)
}
