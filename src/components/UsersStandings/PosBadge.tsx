import { ArrowDown, ArrowUp } from 'lucide-react'

import { cn } from '@/lib/utils'

type TPosBadge = {
	pos: number | null
	prevPos?: number | null
	size?: 'default' | 'lg'
}

export function PosBadge({ pos, prevPos, size = 'default' }: TPosBadge) {
	const moved = pos != null && prevPos != null ? pos - prevPos : null

	return (
		<div className="flex items-center gap-1">
			<span
				className={cn(
					'inline-flex items-center justify-center rounded-md bg-white/10',
					size === 'lg' ? 'size-8' : 'size-7'
				)}
			>
				{pos}
			</span>
			{moved !== null && moved < 0 && (
				<ArrowUp className="text-muted-foreground size-4" />
			)}
			{moved !== null && moved > 0 && (
				<ArrowDown className="text-muted-foreground size-4" />
			)}
		</div>
	)
}
