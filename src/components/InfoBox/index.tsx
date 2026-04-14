import { cn } from '@/lib/utils'

type TInfoBox = {
	children: React.ReactNode
	className?: string
}

export function InfoBox({ children, className }: TInfoBox) {
	return (
		<div
			className={cn(
				'bg-surface border-border/50 rounded-md border p-3',
				className
			)}
		>
			{children}
		</div>
	)
}
