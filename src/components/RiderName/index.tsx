import Link from 'next/link'

import { cn } from '@/lib/utils'

type TRiderName = {
	className?: string
	name: string
	riderId: number
}

export function RiderName({ className, name, riderId }: TRiderName) {
	return (
		<Link className={cn('break-words', className)} href={`/riders/${riderId}`}>
			{name}
		</Link>
	)
}
