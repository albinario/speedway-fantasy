import { getTranslations } from 'next-intl/server'

import { getGpField } from '@/components/PickRidersSheet/data'
import { RiderTile } from '@/components/RiderTile'
import { RiderTilesEmpty } from '@/components/RiderTilesEmpty'
import { getViewer } from '@/lib/auth/get-viewer'
import { getTeamRiders } from '@/lib/team'

import { getUserPicksWithResults } from './data'

type TUserPicks = {
	gpId: number
	gpStartDate: Date | string
	userId: number
}

/**
 * The 3 riders a user has for an upcoming GP. A GP without a picks row yet
 * (odds not saved) shows the current team, which carries over to it.
 * The viewer sees their riders; other users' stay hidden until the GP starts
 * (green ? = has a team, red ? = no team yet).
 */
export async function UserPicks({ gpId, gpStartDate, userId }: TUserPicks) {
	const year = new Date(gpStartDate).getFullYear()

	const [viewer, userPicks, team, t] = await Promise.all([
		getViewer(),
		getUserPicksWithResults(gpId, userId),
		getTeamRiders(userId, year),
		getTranslations('GpCard')
	])

	const isViewer = viewer?.db?.id === userId
	const riders = userPicks.length > 0 ? userPicks : team
	const hasTeam = riders.length > 0

	// Prices as they are for this GP (gps_riders); none before its odds are in
	const field = isViewer && hasTeam ? await getGpField(gpId) : []
	const coinsById = new Map(field.map((r) => [r.id, r.coins]))

	return (
		<div className="flex flex-col gap-4">
			{!isViewer && (
				<div className="font-black uppercase">{t('pickedRiders')}</div>
			)}

			<div className="grid grid-cols-3 gap-2">
				{isViewer && hasTeam ? (
					riders.map((rider) => (
						<RiderTile
							key={rider.id}
							rider={rider}
							coins={coinsById.get(rider.id)}
							linked
							hideFirstName
						/>
					))
				) : (
					<RiderTilesEmpty count={3} variant={hasTeam ? 'green' : 'red'} />
				)}
			</div>
		</div>
	)
}
