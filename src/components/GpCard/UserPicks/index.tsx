import { InfoBox } from '@/components/InfoBox'
import { RiderTile } from '@/components/PickRiders/RiderTile'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'

import { RiderTilesEmpty } from './RiderTilesEmpty'
import { UserPicksClient } from './client'
import { getGpRiders, getUserPicks, getUserPicksWithResults } from './data'

type TUserPicks = {
	gpId: number
	gpName?: string
	gpRound?: number
	gpCountryCode?: string
	userId: number
	macroStage: EMacroStage
}

export async function UserPicks({ gpId, gpName, gpRound, gpCountryCode, userId, macroStage }: TUserPicks) {
	const [viewer, userPicks] = await Promise.all([
		getViewer(),
		getUserPicksWithResults(gpId, userId)
	])

	const isViewer = viewer?.db?.id === userId

	if (isViewer && gpName && gpRound && gpCountryCode) {
		const [initialPicks, riders] = await Promise.all([
			getUserPicks(gpId, userId),
			getGpRiders(gpId)
		])

		return (
			<UserPicksClient
				gpId={gpId}
				userId={userId}
				gpName={gpName}
				gpRound={gpRound}
				gpCountryCode={gpCountryCode}
				initialPicks={initialPicks}
				riders={riders}
				canEdit={macroStage === EMacroStage.Before}
			/>
		)
	}

	const hasPicks = userPicks.length > 0
	const revealed = macroStage !== EMacroStage.Before

	return (
		<InfoBox className="flex flex-col gap-3">
			<div className="font-black uppercase">Picks</div>

			<div className="grid grid-cols-3 gap-2">
				{revealed && hasPicks
					? userPicks.map((rider) => (
							<RiderTile key={rider.id} rider={rider} medal={rider.medal} points={rider.points} />
						))
					: <RiderTilesEmpty count={3} variant={hasPicks ? 'green' : 'red'} />}
			</div>
		</InfoBox>
	)
}
