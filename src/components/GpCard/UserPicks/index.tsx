import { InfoBox } from '@/components/InfoBox'
import { RiderTile } from '@/components/RiderTile'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'

import { getGpRiders, getUserPicks, getUserPicksWithResults } from './data'
import { RiderTilesEmpty } from './RiderTilesEmpty'
import { ViewerPicks } from './ViewerPicks'

type TUserPicks = {
	gpCountryCode: string
	gpId: number
	gpName: string
	gpRound: number
	macroStage: EMacroStage
	userId: number
}

export async function UserPicks({
	gpCountryCode,
	gpId,
	gpName,
	gpRound,
	macroStage,
	userId
}: TUserPicks) {
	const [viewer, userPicks] = await Promise.all([
		getViewer(),
		getUserPicksWithResults(gpId, userId)
	])

	const isViewer = viewer?.db?.id === userId

	if (
		macroStage === EMacroStage.Before &&
		isViewer &&
		gpName &&
		gpRound &&
		gpCountryCode
	) {
		const [initialPicks, riders] = await Promise.all([
			getUserPicks(gpId, userId),
			getGpRiders(gpId)
		])

		return (
			<ViewerPicks
				canEdit={macroStage === EMacroStage.Before}
				gpCountryCode={gpCountryCode}
				gpId={gpId}
				gpName={gpName}
				gpRound={gpRound}
				initialPicks={initialPicks}
				riders={riders}
				viewerId={userId}
			/>
		)
	}

	const hasPicks = userPicks.length > 0
	const revealed = macroStage !== EMacroStage.Before

	return (
		<InfoBox className="flex flex-col gap-4">
			<div className="font-black uppercase">Picked riders</div>

			<div className="grid grid-cols-3 gap-2">
				{revealed && hasPicks ? (
					userPicks.map((rider) => (
						<RiderTile
							key={rider.id}
							linked
							medal={rider.medal}
							points={rider.points}
							rider={rider}
						/>
					))
				) : (
					<RiderTilesEmpty count={3} variant={hasPicks ? 'green' : 'red'} />
				)}
			</div>
		</InfoBox>
	)
}
