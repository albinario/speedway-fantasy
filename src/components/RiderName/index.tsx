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
			className={cn({ 'text-orange-400': highlight }, 'text-center text-wrap')}
			href={`/riders/${riderId}`}
		>
			{name}
		</Link>
	)
}
