import { InfoBox } from '@/components/InfoBox'
import { cn } from '@/lib/utils'

type TPicksCounter = {
	asCard?: boolean
	isOpen: boolean
	picksCount: number
	picksRecord: number
}

export function PicksCounter({
	asCard = false,
	isOpen,
	picksCount,
	picksRecord
}: TPicksCounter) {
	const progress =
		picksRecord > 0 ? Math.min((picksCount / picksRecord) * 100, 100) : 0
	const color = isOpen ? 'text-green-400' : 'text-red-400'
	const barColor = isOpen ? 'bg-green-400' : 'bg-red-400'

	return (
		<InfoBox asCard={asCard}>
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground">Registered picks</span>
				<div className="flex items-baseline gap-1.5">
					<span className={cn('text-lg leading-none', color)}>
						{picksCount}
					</span>
					{picksRecord > 0 && (
						<span className="text-muted-foreground text-xs">
							• {picksRecord} record
						</span>
					)}
				</div>
			</div>

			{picksRecord > 0 && (
				<div className="bg-background h-1.5 w-full overflow-hidden rounded-full">
					<div
						className={cn('h-full rounded-full transition-all', barColor)}
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}
		</InfoBox>
	)
}
