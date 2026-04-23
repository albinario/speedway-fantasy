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

			<div className="flex gap-0.5">
				{Array.from({ length: MAX_HEATS }, (_, i) => (
					<div
						key={i}
						className={`h-1.5 flex-1 rounded-full transition-all ${i < heatsFinished ? 'bg-green-400' : 'bg-foreground/10'}`}
					/>
				))}
			</div>
		</div>
	)
}
