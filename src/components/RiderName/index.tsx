import Link from 'next/link'

import { cn } from '@/lib/utils'

type TRiderName = {
	name: string | null | undefined
	riderId: number
	highlight?: boolean
}

export function RiderName({ name, riderId, highlight = false }: TRiderName) {
	return (
		<Link
			className={cn('text-center text-wrap', highlight && 'text-orange-400')}
			href={`/riders/${riderId}`}
		>
			{name}
		</Link>
	)
}
