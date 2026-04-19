import { Users } from 'lucide-react'

import { ActivityFeed } from '@/components/ActivityFeed'
import { InfoBox } from '@/components/InfoBox'

import { getPicksCount } from './data'

type TRegisteredPlayers = {
	gpId: number
	showActivity: boolean
}

export async function RegisteredPlayers({
	gpId,
	showActivity = false
}: TRegisteredPlayers) {
	const { count } = await getPicksCount(gpId)

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-start justify-between font-black uppercase">
				<span>Registered players</span>

				<div className="flex items-end gap-1">
					<span className="text-2xl leading-none font-black text-green-400">
						{count}
					</span>

					<Users className="mb-0.5 size-5 text-green-400" />
				</div>
			</div>

			{showActivity && <ActivityFeed gpId={gpId} />}
		</div>
	)
}
