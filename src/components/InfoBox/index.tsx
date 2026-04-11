import { cn } from '@/lib/utils'

type TInfoBox = {
	children: React.ReactNode
	className?: string
}

export function InfoBox({ children, className }: TInfoBox) {
	return (
		<div className={cn('bg-infobox rounded-md border border-border/50 p-3', className)}>
			{children}
		</div>
	)
}
