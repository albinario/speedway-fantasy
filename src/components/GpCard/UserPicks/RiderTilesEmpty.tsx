type TRiderTilesEmpty = {
	count: number
	variant?: 'default' | 'green' | 'red'
}

const variantStyles = {
	default: { circle: 'bg-muted', text: 'text-muted-foreground' },
	green: { circle: 'bg-green-400/10', text: 'text-green-400' },
	red: { circle: 'bg-red-400/10', text: 'text-red-400' }
}

export function RiderTilesEmpty({
	count,
	variant = 'default'
}: TRiderTilesEmpty) {
	const { circle, text } = variantStyles[variant]

	return (
		<>
			{Array.from({ length: count }, (_, i) => (
				<div
					key={i}
					className="flex flex-col items-center gap-1 rounded-lg bg-black/40 p-3"
				>
					<div
						className={`${circle} flex size-14 items-center justify-center rounded-full`}
					>
						<span className={`${text} text-lg`}>?</span>
					</div>
				</div>
			))}
		</>
	)
}
