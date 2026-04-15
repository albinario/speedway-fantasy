import { getNextGp } from '@/app/gps/data'
import { getGpRiders, getUserPicks } from '@/components/GpCard/UserPicks/data'
import { getViewer } from '@/lib/auth/get-viewer'

import { PickRidersButton } from './PickRidersButton'

export async function PickRidersLoader() {
	const [viewer, nextGp] = await Promise.all([getViewer(), getNextGp()])

	const viewerId = viewer.db?.id
	if (!nextGp || !viewerId) return null

	const [riders, initialPicks] = await Promise.all([
		getGpRiders(nextGp.id),
		getUserPicks(nextGp.id, viewerId)
	])

	return (
		<PickRidersButton
			gpId={nextGp.id}
			gpName={nextGp.city_name}
			gpRound={nextGp.round}
			gpCountryCode={nextGp.country_code}
			viewerId={viewerId}
			riders={riders}
			initialPicks={initialPicks}
		/>
	)
}
