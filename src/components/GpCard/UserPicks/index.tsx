import { RiderTilesEmpty } from '@/components/RiderTilesEmpty'
import { getViewer } from '@/lib/auth/get-viewer'

import { getGpRiders, getUserPicks, getUserPicksWithResults } from './data'
import { ViewerPicks } from './ViewerPicks'

type TUserPicks = {
	gpCountryCode: string
	gpId: number
	gpName: string
	gpRound: number
	userId: number
}

export async function UserPicks({
	gpCountryCode,
	gpId,
	gpName,
	gpRound,
	userId
}: TUserPicks) {
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
			<ViewerPicks
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

	return (
		<>
			<div className="font-black uppercase">Picked riders</div>

			<div className="grid grid-cols-3 gap-2">
				<RiderTilesEmpty count={3} variant={hasPicks ? 'green' : 'red'} />
			</div>
		</>
	)
}
