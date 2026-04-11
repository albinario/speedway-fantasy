import { TopRanks } from './TopRanks'
import { ViewerResultRow } from './ViewerResultRow'

type TAfter = {
	gpId: number
	viewerId?: number
}

export function After({ gpId, viewerId }: TAfter) {
	return (
		<div className="flex flex-col gap-2">
			{viewerId && <ViewerResultRow gpId={gpId} viewerId={viewerId} />}
			<TopRanks gpId={gpId} />
		</div>
	)
}
