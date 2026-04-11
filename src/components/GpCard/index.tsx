import { LogIn } from 'lucide-react'

import type { getGps } from '@/app/gps/data'
import { RegisteredPicks } from '@/components/RegisteredPicks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { WildCardInfoBox } from '@/components/WildCardInfoBox'
import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'

import { After } from './After'
import { Before } from './Before'
import { getGpRiders, getViewerPicks } from './data'
import { During } from './During'
import { GpCardHeader } from './Header'

type TGpCard = {
	gp: Awaited<ReturnType<typeof getGps>>[number]
	isUpNext?: boolean
	linked?: boolean
	macroStage?: EMacroStage
	viewerId?: number
}

export async function GpCard({
	gp,
	isUpNext = false,
	linked = false,
	macroStage: macroStageProp,
	viewerId
}: TGpCard) {
	const macroStage = macroStageProp ?? getMacroStage(gp.start_date, gp.finished)
	const href = linked ? `/gps/${gp.id}` : undefined

	const [riders, existingPicks] = viewerId
		? await Promise.all([
				getGpRiders(gp.id, gp.wild_card_id),
				getViewerPicks(gp.id, viewerId)
			])
		: [[], null]

	return (
		<Card id={isUpNext ? 'up-next' : undefined} className="mx-auto w-full pt-0">
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

			<CardContent className="flex flex-col gap-3">
				{macroStage === EMacroStage.During && (
					<During
						gpId={gp.id}
						heatsFinished={gp.heats_finished ?? 0}
						viewerId={viewerId}
					/>
				)}

				{macroStage === EMacroStage.After && (
					<After gpId={gp.id} viewerId={viewerId} />
				)}

				<WildCardInfoBox
					countryCode={gp.wild_card_country_code}
					name={gp.wild_card_name}
					riderId={gp.wild_card_id}
				/>

				<RegisteredPicks gpId={gp.id} macroStage={macroStage} />

				{macroStage === EMacroStage.Before && (
					<Before
						gpId={gp.id}
						gpName={gp.city_name}
						gpRound={gp.round}
						viewerId={viewerId}
						riders={riders}
						existingPicks={existingPicks ?? null}
					/>
				)}
			</CardContent>

			{!viewerId && macroStage === EMacroStage.Before && (
				<CardFooter>
					<Button asChild className="w-full" variant="outline">
						<a href="/auth/login">
							Sign in to pick riders
							<LogIn className="size-4" />
						</a>
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}
