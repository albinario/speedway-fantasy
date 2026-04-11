import { Users } from 'lucide-react'

import { ActivityFeed } from '@/components/ActivityFeed'
import { Badge } from '@/components/ui/badge'
import { InfoBox } from '@/components/InfoBox'
import { EMacroStage } from '@/enums'

import { getPicksCount, getPicksRecord } from './data'

type TRegisteredPicks = {
	gpId: number
	macroStage?: EMacroStage
}

export async function RegisteredPicks({ gpId, macroStage }: TRegisteredPicks) {
	const [{ count }, { record }] = await Promise.all([
		getPicksCount(gpId),
		getPicksRecord()
	])

	return (
		<InfoBox className="flex flex-col gap-3">
			<div className="flex items-center justify-between font-black uppercase">
				<span>Registered players</span>

				<div className="flex items-center gap-2">
					<Badge variant="success">
						<Users />
						{count}
					</Badge>

					{record > 0 && (
						<span className="text-muted-foreground text-xs normal-case">
							record {record}
						</span>
					)}
				</div>
			</div>

			{macroStage === EMacroStage.Before && (
				<ActivityFeed gpId={gpId} />
			)}
		</InfoBox>
	)
}
