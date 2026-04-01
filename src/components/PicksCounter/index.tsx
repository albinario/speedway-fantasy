import { InfoBox } from '@/components/InfoBox'
import { cn } from '@/lib/utils'

import { getPicksCount, getPicksRecord } from './data'

type TPicksCounter = {
	gpId: number
}

export async function PicksCounter({ gpId }: TPicksCounter) {
	const [{ count: picksCount }, { record: picksRecord }] = await Promise.all([
		getPicksCount(gpId),
		getPicksRecord()
	])

	const progress =
		picksRecord > 0 ? Math.min((picksCount / picksRecord) * 100, 100) : 0
	const color =
		progress <= 30
			? 'text-red-400'
			: progress <= 89
				? 'text-yellow-400'
				: 'text-green-400'
	const barColor =
		progress <= 30
			? 'bg-red-400'
			: progress <= 89
				? 'bg-yellow-400'
				: 'bg-green-400'

	return (
		<InfoBox>
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-xs">Registered picks</span>
				<div className="flex items-baseline gap-1.5">
					<span className={cn('text-lg leading-none', color)}>
						{picksCount}
					</span>
					{picksRecord > 0 && (
						<span className="text-muted-foreground text-xs">
							/ {picksRecord} record
						</span>
					)}
				</div>
			</div>

			{picksRecord > 0 && (
				<div className="bg-background mt-2 h-1.5 w-full overflow-hidden rounded-full">
					<div
						className={cn('h-full rounded-full transition-all', barColor)}
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}
		</InfoBox>
	)
}
