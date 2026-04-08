import Link from 'next/link'

import { StarIcon } from 'lucide-react'

import { getMedalColor } from '@/lib/medals'
import { cn } from '@/lib/utils'

type TUserName = {
	className?: string
	firstName: string | null
	lastName: string | null
	stars?: number[] | null
	userId: number
}

export function UserName({
	className,
	userId,
	firstName,
	lastName,
	stars
}: TUserName) {
	return (
		<Link
			className={cn(
				'inline-flex items-baseline gap-1 truncate uppercase',
				className
			)}
			href={`/users/${userId}`}
		>
			{firstName} {lastName}
			{stars && stars.length > 0 && (
				<span className="inline-flex -translate-y-1 gap-0.5 [&_svg]:size-2.5">
					{stars.filter(Boolean).map((type, i) => {
						const medalColor = getMedalColor(type)
						return <StarIcon key={i} fill={medalColor} stroke={medalColor} />
					})}
				</span>
			)}
		</Link>
	)
}
