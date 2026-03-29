import { PickRidersTrigger, type TPickRider } from '@/components/PickRiders'

type TGpCardBefore = {
	gpId: number
	gpName: string
	gpRound: number
	viewerId?: number
	riders: TPickRider[]
	existingPicks: {
		rider_1_id: number
		rider_2_id: number
		rider_3_id: number
	} | null
}

export function Before({
	gpId,
	gpName,
	gpRound,
	viewerId,
	riders,
	existingPicks
}: TGpCardBefore) {
	if (viewerId == null) return null

	return (
		<PickRidersTrigger
			gpId={gpId}
			gpName={gpName}
			gpRound={gpRound}
			viewerId={viewerId}
			riders={riders}
			existingPicks={existingPicks}
		/>
	)
}
