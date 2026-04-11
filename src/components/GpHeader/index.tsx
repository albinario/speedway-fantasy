import Image from 'next/image'

import { Countdown } from '@/components/Countdown'
import { Flag } from '@/components/Flag'
import { LiveBadge } from '@/components/LiveBadge'
import { StartTimeNote } from '@/components/StartTimeNote'
import { EMacroStage } from '@/enums'
import { formatDate } from '@/lib/dates'

type TGpHeader = {
	cityId: number
	cityName: string
	countryCode: string
	round: number
	startDate: Date | string | null
	timeZone: string
	macroStage: EMacroStage
	showCountdown?: boolean
}

export function GpHeader({
	cityId,
	cityName,
	countryCode,
	round,
	startDate,
	timeZone,
	macroStage,
	showCountdown = false
}: TGpHeader) {
	return (
		<>
			<Image
				alt=""
				src={`/cities/${cityId}.jpg`}
				width={600}
				height={300}
				className="relative z-20 aspect-video w-full object-cover brightness-60"
			/>

			<div className="absolute top-3 left-3 z-40">
				{macroStage === EMacroStage.During && <LiveBadge />}
				{showCountdown && startDate && macroStage === EMacroStage.Before && (
					<Countdown startDate={new Date(startDate)} />
				)}
			</div>

			<div
				aria-hidden="true"
				className="absolute inset-0 z-30 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-colors duration-200 group-hover:bg-black/20"
			/>

			<div className="absolute inset-0 z-40 flex flex-col justify-end gap-1 p-4">
				<Flag countryCode={countryCode} />
				<h2 className="text-2xl uppercase">{cityName}</h2>
				<p className="text-xs uppercase opacity-80">
					<span className="text-brand">Round {round}</span>
					{' • '}
					{formatDate(startDate, timeZone)}
					<StartTimeNote date={startDate} eventTimeZone={timeZone} />
				</p>
			</div>
		</>
	)
}
