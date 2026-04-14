import Image from 'next/image'
import Link from 'next/link'

import { ChevronRight } from 'lucide-react'

import { Countdown } from '@/components/Countdown'
import { Flag } from '@/components/Flag'
import { LiveBadge } from '@/components/LiveBadge'
import { StartTimeNote } from '@/components/StartTimeNote'
import { EMacroStage } from '@/enums'
import { formatDate } from '@/lib/dates'

type TGpCardHeader = {
	href?: string
	cityId: number
	cityName: string
	countryCode: string
	round: number
	startDate: Date | string | null
	timeZone: string
	macroStage: EMacroStage
	showCountdown?: boolean
}

export function GpCardHeader({
	href,
	cityId,
	cityName,
	countryCode,
	round,
	startDate,
	timeZone,
	macroStage,
	showCountdown = false
}: TGpCardHeader) {
	const header = (
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
				<Flag countryCode={countryCode} className="size-8" />
				<h2 className="text-3xl font-black uppercase">{cityName}</h2>
				<div className="text-sm font-black uppercase opacity-80">
					<span className="text-brand-red">Round {round}</span>
					{' • '}
					{formatDate(startDate, timeZone)}

					{macroStage !== EMacroStage.After && (
						<StartTimeNote date={startDate} eventTimeZone={timeZone} />
					)}
				</div>
			</div>
		</>
	)

	if (!href) return <div className="relative block">{header}</div>

	return (
		<Link className="group relative block" href={href}>
			{header}
			<div className="text-brand-red absolute top-3 right-3 z-40 flex items-center gap-0 overflow-hidden rounded-full bg-black/40 p-1.5 backdrop-blur-sm transition-all duration-300 group-hover:gap-1.5 group-hover:pl-3">
				<span className="max-w-0 overflow-hidden text-xs font-semibold whitespace-nowrap uppercase transition-all duration-300 group-hover:max-w-20">
					View GP
				</span>

				<ChevronRight className="size-4 shrink-0" />
			</div>
		</Link>
	)
}
