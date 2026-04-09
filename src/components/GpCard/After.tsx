import { InfoBox } from '@/components/InfoBox'
import { InfoBoxTitle } from '@/components/InfoBox/Title'
import { PickedRiders } from '@/components/PickRiders/PickedRiders'
import type { TPickRider } from '@/components/PickRiders/Sheet'
import { ViewerGpResult } from '@/components/ViewerGpResult'

import { TopRanks } from './TopRanks'

type TExistingPicks = {
	rider_1_id: number
	rider_2_id: number
	rider_3_id: number
}

type TAfter = {
	gpId: number
	viewerId?: number
	riders: TPickRider[]
	existingPicks: TExistingPicks | null
}

export function After({ gpId, viewerId, riders, existingPicks }: TAfter) {
	const pickedRiders = existingPicks
		? ([
				existingPicks.rider_1_id,
				existingPicks.rider_2_id,
				existingPicks.rider_3_id
			]
				.map((id) => riders.find((r) => r.id === id))
				.filter(Boolean) as TPickRider[])
		: null

	return (
		<div className="flex flex-col gap-2">
			{viewerId && <ViewerGpResult gpId={gpId} viewerId={viewerId} />}

			{pickedRiders && (
				<InfoBox>
					<div className="flex flex-wrap">
						<InfoBoxTitle>My picks</InfoBoxTitle>

						<div className="ml-auto">
							<PickedRiders riders={pickedRiders} />
						</div>
					</div>
				</InfoBox>
			)}
			<TopRanks gpId={gpId} />
		</div>
	)
}
