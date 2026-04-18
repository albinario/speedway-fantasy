import { getActiveGp } from '@/app/gps/data'
import { getActiveRidersForGp } from '@/app/riders/data'

export async function getActiveGpWithRiders() {
	const gp = await getActiveGp()
	if (!gp) return null

	const riders = await getActiveRidersForGp(gp.id)
	return { gp, riders }
}
