import { cn } from '@/lib/utils'

type TRiderPlaceholder = {
	className?: string
}

export function RiderPlaceholder({ className }: TRiderPlaceholder) {
	return (
		<div
			className={cn(
				'rounded-full bg-muted flex items-center justify-center',
				className
			)}
		>
			<span className="text-muted-foreground text-sm">?</span>
		</div>
	)
}
