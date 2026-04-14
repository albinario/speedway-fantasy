import { Users } from 'lucide-react'

import { ActivityFeed } from '@/components/ActivityFeed'
import { InfoBox } from '@/components/InfoBox'

import { getPicksCount, getPicksRecord } from './data'

type TRegisteredPlayers = {
	gpId: number
	showActivity: boolean
}

export async function RegisteredPlayers({
	gpId,
	showActivity = false
}: TRegisteredPlayers) {
	const [{ count }, { record }] = await Promise.all([
		getPicksCount(gpId),
		getPicksRecord()
	])

	return (
		<InfoBox className="flex flex-col">
			<div className="flex items-start justify-between font-black uppercase">
				<span>Registered players</span>

				<div className="flex shrink-0 gap-2">
					<div className="flex items-end gap-1">
						<span className="text-2xl leading-none font-black text-green-400">
							{count}
						</span>

						<Users className="mb-0.5 size-5 text-green-400" />
					</div>

					{record > 0 && (
						<span className="text-muted-foreground text-xs normal-case">
							record {record}
						</span>
					)}
				</div>
			</div>

			{showActivity && <ActivityFeed gpId={gpId} />}
		</InfoBox>
	)
}
