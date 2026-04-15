import type { getGps } from '@/app/gps/data'
import { Card, CardContent } from '@/components/ui/card'
import { EMacroStage } from '@/enums'

import { GpCardHeader } from './Header'

type TGpCardBase = {
	gp: Awaited<ReturnType<typeof getGps>>[number]
	isUpNext?: boolean
	linked?: boolean
	macroStage: EMacroStage
	children?: React.ReactNode
}

export function GpCardBase({
	gp,
	isUpNext = false,
	linked = false,
	macroStage,
	children
}: TGpCardBase) {
	const href = linked ? `/gps/${gp.id}` : undefined

	return (
		<Card id={isUpNext ? 'up-next' : undefined} className="mx-auto w-full">
			<GpCardHeader
				href={href}
				cityId={gp.city_id}
				cityName={gp.city_name}
				countryCode={gp.country_code}
				round={gp.round}
				startDate={gp.start_date}
				timeZone={gp.time_zone}
				macroStage={macroStage}
				showCountdown={isUpNext}
			/>

			<CardContent className="flex flex-col gap-4">{children}</CardContent>
		</Card>
	)
}
