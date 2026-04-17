import type { getGps } from '@/app/gps/data'
import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'

import { RegisteredPlayers } from '../RegisteredPlayers'
import { GpCardBase } from './Base'
import { UserPicks } from './UserPicks'
import { UserResultRow } from './UserResultRow/UserResultRow'

type TUserGpCard = {
	gp: Awaited<ReturnType<typeof getGps>>[number]
	isUpNext?: boolean
	macroStage?: EMacroStage
	userId: number
}

export async function UserGpCard({
	gp,
	isUpNext = false,
	macroStage: macroStageProp,
	userId
}: TUserGpCard) {
	const macroStage = macroStageProp ?? getMacroStage(gp.start_date, gp.finished)

	return (
		<GpCardBase gp={gp} isUpNext={isUpNext} linked macroStage={macroStage}>
			{macroStage !== EMacroStage.Before && (
				<UserResultRow gpId={gp.id} userId={userId} />
			)}

			<UserPicks
				gpId={gp.id}
				gpName={gp.city_name}
				gpRound={gp.round}
				gpCountryCode={gp.country_code}
				userId={userId}
				macroStage={macroStage}
			/>

			<RegisteredPlayers
				gpId={gp.id}
				showActivity={macroStage === EMacroStage.Before}
			/>
		</GpCardBase>
	)
}
