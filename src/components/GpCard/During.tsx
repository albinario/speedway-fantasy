import { HeatsFinished } from '@/components/HeatsFinished'

import { ViewerResultRow } from './ViewerResultRow'

type TDuring = {
	gpId: number
	heatsFinished: number
	viewerId?: number
}

export function During({ gpId, heatsFinished, viewerId }: TDuring) {
	return (
		<div className="flex flex-col gap-2">
			<HeatsFinished heatsFinished={heatsFinished} />
			{viewerId && <ViewerResultRow gpId={gpId} viewerId={viewerId} />}
		</div>
	)
}
