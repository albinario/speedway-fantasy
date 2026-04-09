import { cn } from '@/lib/utils'

type TInfoBox = {
	children: React.ReactNode
	className?: string
}

export function InfoBox({ children, className }: TInfoBox) {
	return (
		<div className={cn('bg-muted/50 rounded-md p-3', className)}>
			{children}
		</div>
	)
}
