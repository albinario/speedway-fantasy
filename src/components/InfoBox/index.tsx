import { cn } from '@/lib/utils'

type TInfoBox = {
	children: React.ReactNode
	className?: string
}

// TODO: do we still use this?
export function InfoBox({ children, className }: TInfoBox) {
	return (
		<div className={cn('bg-surface rounded-md p-3', className)}>{children}</div>
	)
}
