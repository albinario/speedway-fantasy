import { ArrowDown, ArrowUp } from 'lucide-react'

import { cn } from '@/lib/utils'

type TPosBadge = {
	pos: number | null
	prevPos?: number | null
	size?: 'default' | 'lg'
	tiedPos?: boolean
}

export function PosBadge({ pos, prevPos, size = 'default', tiedPos }: TPosBadge) {
	const moved = pos != null && prevPos != null ? pos - prevPos : null

	return (
		<div className="flex items-center gap-1">
			<span
				className={cn(
					'inline-flex items-center justify-center rounded-md bg-white/10',
					size === 'lg' ? 'size-8' : 'size-7'
				)}
			>
				<span className={tiedPos ? 'text-muted-foreground' : ''}>{pos}</span>
			</span>

			{moved !== null && moved < 0 && (
				<ArrowUp className="size-4 text-green-400" />
			)}
			{moved !== null && moved > 0 && (
				<ArrowDown className="size-4 text-red-400" />
			)}
		</div>
	)
}
