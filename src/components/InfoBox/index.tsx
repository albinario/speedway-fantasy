import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type TInfoBox = {
	asCard?: boolean
	children: React.ReactNode
	className?: string
}

export function InfoBox({ asCard = false, children, className }: TInfoBox) {
	if (asCard) {
		return (
			<Card>
				<CardContent className={cn('flex flex-col gap-2', className)}>
					{children}
				</CardContent>
			</Card>
		)
	}

	return (
		<div
			className={cn(
				'bg-muted/50 flex flex-col gap-2 rounded-md px-3 py-2',
				className
			)}
		>
			{children}
		</div>
	)
}
