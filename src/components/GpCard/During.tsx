import { ViewerGpResult } from '@/components/ViewerGpResult'

import { HeatsFinished } from './HeatsFinished'
import { TopRanks } from './TopRanks'

type TDuring = {
	gpId: number
	heatsFinished: number
	viewerId?: number
}

export function During({ gpId, heatsFinished, viewerId }: TDuring) {
	return (
		<div className="flex flex-col gap-2">
			<HeatsFinished heatsFinished={heatsFinished} />
			{viewerId && <ViewerGpResult gpId={gpId} viewerId={viewerId} />}
			<TopRanks gpId={gpId} />
		</div>
	)
}
