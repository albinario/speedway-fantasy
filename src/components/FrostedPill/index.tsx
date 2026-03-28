import { cn } from '@/lib/utils'

type TFrostedPill = {
	children: React.ReactNode
	className?: string
}

export function FrostedPill({ children, className }: TFrostedPill) {
	return (
		<div
			className={cn(
				'inline-flex items-center gap-1.5 rounded-md bg-black/50 px-2.5 py-1.5 backdrop-blur-sm',
				className
			)}
		>
			{children}
		</div>
	)
}
