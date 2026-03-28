import { ViewerGpResult } from '@/components/ViewerGpResult'

import { TopRanks } from './TopRanks'

type TAfter = {
	gpId: number
	viewerId?: number
}

export function After({ gpId, viewerId }: TAfter) {
	return (
		<div className="flex flex-col gap-2">
			{viewerId && <ViewerGpResult gpId={gpId} viewerId={viewerId} />}
			<TopRanks gpId={gpId} />
		</div>
	)
}
