import { getUserPicksWithResults } from '@/components/GpCard/UserPicks/data'
import { RiderTile } from '@/components/RiderTile'
import { Card, CardContent } from '@/components/ui/card'

type TViewerPicksCard = {
	gpId: number
	viewerId: number
}

/** The viewer's 3 riders for a GP that has started, beside the GP card. */
export async function ViewerPicksCard({ gpId, viewerId }: TViewerPicksCard) {
	const picks = await getUserPicksWithResults(gpId, viewerId)
	if (picks.length === 0) return null

	return (
		<Card>
			<CardContent className="grid grid-cols-3 gap-2 pt-4">
				{picks.map((rider) => (
					<RiderTile key={rider.id} rider={rider} linked hideFirstName />
				))}
			</CardContent>
		</Card>
	)
}
