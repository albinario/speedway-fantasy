import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { GpHeader } from '@/components/GpHeader'
import { EMacroStage } from '@/enums'

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
	showCountdown
}: TGpCardHeader) {
	const header = (
		<GpHeader
			cityId={cityId}
			cityName={cityName}
			countryCode={countryCode}
			round={round}
			startDate={startDate}
			timeZone={timeZone}
			macroStage={macroStage}
			showCountdown={showCountdown}
		/>
	)

	if (!href) return <div className="relative block">{header}</div>

	return (
		<Link className="group relative block" href={href}>
			{header}
			<div className="absolute top-3 right-3 z-40 flex items-center gap-0 overflow-hidden rounded-full bg-black/40 p-1.5 backdrop-blur-sm transition-all duration-300 group-hover:gap-1.5 group-hover:pl-3">
				<span className="max-w-0 overflow-hidden text-xs font-semibold whitespace-nowrap text-orange-400 transition-all duration-300 group-hover:max-w-20">
					View GP
				</span>
				<ArrowRight className="size-4 shrink-0 text-orange-400" strokeWidth={2.5} />
			</div>
		</Link>
	)
}
