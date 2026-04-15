import { LogIn } from 'lucide-react'

import type { getGps } from '@/app/gps/data'
import { HeatsFinished } from '@/components/HeatsFinished'
import { RegisteredPlayers } from '@/components/RegisteredPlayers'
import { Button } from '@/components/ui/button'
import { WildCardInfoBox } from '@/components/WildCardInfoBox'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMacroStage } from '@/lib/dates'

import { GpCardBase } from './Base'
import { TopPlayers } from './TopPlayers'
import { TopRiders } from './TopRiders'
import { UserPicks } from './UserPicks'
import { UserResultRow } from './UserResultRow/UserResultRow'

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
	viewerId: viewerIdProp
}: TGpCard) {
	const macroStage = macroStageProp ?? getMacroStage(gp.start_date, gp.finished)
	const viewerId = viewerIdProp ?? (await getViewer())?.db?.id

	return (
		<GpCardBase
			gp={gp}
			isUpNext={isUpNext}
			linked={linked}
			macroStage={macroStage}
		>
			{!viewerId && macroStage === EMacroStage.Before && (
				<Button className="w-full" asChild variant="outline">
					<a href="/auth/login">
						Sign in to pick riders
						<LogIn className="size-4" />
					</a>
				</Button>
			)}

			{macroStage === EMacroStage.During && (
				<HeatsFinished heatsFinished={gp.heats_finished ?? 0} />
			)}

			{!!viewerId && macroStage !== EMacroStage.Before && (
				<UserResultRow gpId={gp.id} userId={viewerId} />
			)}

			{!!viewerId && (
				<UserPicks
					gpCountryCode={gp.country_code}
					gpId={gp.id}
					gpName={gp.city_name}
					gpRound={gp.round}
					macroStage={macroStage}
					userId={viewerId}
				/>
			)}

			{macroStage === EMacroStage.After && <TopPlayers gpId={gp.id} />}

			{macroStage === EMacroStage.After && (
				<TopRiders gpId={gp.id} viewerId={viewerId} />
			)}

			<WildCardInfoBox
				countryCode={gp.wild_card_country_code}
				name={gp.wild_card_name}
				riderId={gp.wild_card_id}
			/>

			<RegisteredPlayers
				gpId={gp.id}
				showActivity={macroStage === EMacroStage.Before}
			/>
		</GpCardBase>
	)
}
