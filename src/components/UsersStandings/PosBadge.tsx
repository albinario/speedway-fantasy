import { ArrowDown, ArrowUp } from 'lucide-react'

import { getMedalColorStr } from '@/lib/medals'

type TPosBadge = {
	pos: number | null | undefined
	prevPos: number | null | undefined
}

export function PosBadge({ pos, prevPos }: TPosBadge) {
	const isMedal = pos != null && pos <= 3
	const moved = pos != null && prevPos != null ? pos - prevPos : null

	return (
		<div className="flex items-center gap-1">
			<span
				className={`inline-flex size-7 items-center justify-center rounded-md ${isMedal ? `${getMedalColorStr(pos, 'bg')} text-black` : 'bg-white/10'}`}
			>
				{pos}
			</span>
			{moved !== null && moved < 0 && (
				<ArrowUp className="size-4 text-green-400" />
			)}
			{moved !== null && moved > 0 && (
				<ArrowDown className="size-4 text-red-500" />
			)}
		</div>
	)
}
