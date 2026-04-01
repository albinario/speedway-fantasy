import { LogIn } from 'lucide-react'

import { PickRidersTrigger, type TPickRider } from '@/components/PickRiders'
import { Button } from '@/components/ui/button'

type TExistingPicks = {
	rider_1_id: number
	rider_2_id: number
	rider_3_id: number
}

type TBefore = {
	gpId: number
	gpName: string
	gpRound: number
	viewerId?: number
	riders: TPickRider[]
	existingPicks: TExistingPicks | null
}

export function Before({
	gpId,
	gpName,
	gpRound,
	viewerId,
	riders,
	existingPicks
}: TBefore) {
	if (viewerId == null)
		return (
			<Button asChild className="w-full" variant="outline">
				<a href="/auth/login">
					Sign in to pick riders
					<LogIn className="size-4" />
				</a>
			</Button>
		)

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
