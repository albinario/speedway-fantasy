import { InfoBox } from '@/components/InfoBox'

const MAX_HEATS = 23

type THeatsFinished = {
	heatsFinished: number
}

export function HeatsFinished({ heatsFinished }: THeatsFinished) {
	const progress = Math.min((heatsFinished / MAX_HEATS) * 100, 100)

	return (
		<InfoBox>
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground">Heats</span>
				<div className="flex items-baseline gap-1.5">
					<span className="text-lg leading-none text-green-400">
						{heatsFinished}
					</span>
					<span className="text-muted-foreground text-xs">/ {MAX_HEATS}</span>
				</div>
			</div>

			<div className="bg-background mt-2 h-1.5 w-full overflow-hidden rounded-full">
				<div
					className="h-full rounded-full bg-green-400 transition-all"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</InfoBox>
	)
}
