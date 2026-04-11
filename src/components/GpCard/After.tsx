import { MyPicks } from './MyPicks'
import { TopPlayers } from './TopPlayers'
import { TopRiders } from './TopRiders'
import { ViewerResultRow } from './ViewerResultRow'

type TAfter = {
	gpId: number
	viewerId?: number
}

export function After({ gpId, viewerId }: TAfter) {
	return (
		<>
			{viewerId && <ViewerResultRow gpId={gpId} viewerId={viewerId} />}
			{viewerId && <MyPicks gpId={gpId} viewerId={viewerId} />}
			<TopPlayers gpId={gpId} />
			<TopRiders gpId={gpId} />
		</>
	)
}
