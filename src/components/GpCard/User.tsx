import type { getGps } from '@/app/gps/data'
import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'

import { RegisteredPlayers } from '../RegisteredPlayers'
import { GpCardBase } from './Base'
import { UserPicks } from './UserPicks'
import { UserPicksResults } from './UserPicks/Results'
import { UserResultRow } from './UserResultRow/UserResultRow'

type TUserGpCard = {
	gp: Awaited<ReturnType<typeof getGps>>[number]
	macroStage?: EMacroStage
	userId: number
	viewerId?: number
}

export async function UserGpCard({
	gp,
	macroStage: macroStageProp,
	userId,
	viewerId
}: TUserGpCard) {
	const macroStage = macroStageProp ?? getMacroStage(gp.start_date, gp.finished)

	return (
		<GpCardBase gp={gp} linked macroStage={macroStage}>
			{macroStage === EMacroStage.Before && (
				<UserPicks
					gpId={gp.id}
					gpName={gp.city_name}
					gpRound={gp.round}
					gpCountryCode={gp.country_code}
					userId={userId}
				/>
			)}

			{macroStage !== EMacroStage.Before && (
				<>
					{viewerId && viewerId !== userId && (
						<UserResultRow gpId={gp.id} isViewer userId={viewerId} />
					)}
					<UserResultRow
						gpId={gp.id}
						isViewer={viewerId === userId}
						userId={userId}
					/>
					<UserPicksResults gpId={gp.id} userId={userId} />
				</>
			)}

			<RegisteredPlayers
				gpId={gp.id}
				showActivity={macroStage === EMacroStage.Before}
			/>
		</GpCardBase>
	)
}
