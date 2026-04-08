import { ActivityFeed } from '@/components/ActivityFeed'
import { InfoBox } from '@/components/InfoBox'
import { InfoBoxTitle } from '@/components/InfoBox/Title'
import { EMacroStage } from '@/enums'
import { getProgressColor } from '@/lib/progress'
import { cn } from '@/lib/utils'

import { getPicksCount, getPicksRecord } from './data'

type TPicksCounter = {
	gpId: number
	macroStage?: EMacroStage
}

export async function PicksCounter({ gpId, macroStage }: TPicksCounter) {
	const [{ count }, { record }] = await Promise.all([
		getPicksCount(gpId),
		getPicksRecord()
	])

	const progress = record > 0 ? Math.min((count / record) * 100, 100) : 0
	const { textColor, bgColor } = getProgressColor(progress)

	return (
		<InfoBox>
			<div>
				<div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
					<InfoBoxTitle>Registered picks</InfoBoxTitle>

					<div className="ml-auto flex items-baseline gap-1.5">
						<span className={cn('text-lg leading-none', textColor)}>
							{count}
						</span>

						{record > 0 && (
							<span className="text-muted-foreground text-xs">
								/ {record} record
							</span>
						)}
					</div>
				</div>

				{record > 0 && (
					<div className="bg-background mt-2 h-1.5 w-full overflow-hidden rounded-full">
						<div
							className={cn('h-full rounded-full transition-all', bgColor)}
							style={{ width: `${progress}%` }}
						/>
					</div>
				)}
			</div>

			{macroStage === EMacroStage.Before && <ActivityFeed gpId={gpId} />}
		</InfoBox>
	)
}
