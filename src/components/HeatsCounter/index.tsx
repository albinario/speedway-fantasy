const MAX_HEATS = 23

type THeatsFinished = {
	heatsFinished: number
}

export function HeatsCounter({ heatsFinished }: THeatsFinished) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-baseline justify-between">
				<span className="text-muted-foreground">Heats</span>

				<div className="flex items-baseline gap-1.5">
					<span className="text-lg leading-none text-green-400">
						{heatsFinished}
					</span>
					<span className="text-muted-foreground text-xs">/ {MAX_HEATS}</span>
				</div>
			</div>

			<div className="bg-foreground/10 h-1.5 w-full overflow-hidden rounded-full">
				<div
					className="h-full rounded-full bg-gradient-to-r from-green-400/60 to-green-400 transition-all"
					style={{ width: `${(heatsFinished / MAX_HEATS) * 100}%` }}
				/>
			</div>
		</div>
	)
}
