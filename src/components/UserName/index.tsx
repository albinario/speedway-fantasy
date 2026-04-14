import Link from 'next/link'

import { StarIcon } from 'lucide-react'

import { getMedalColorHex } from '@/lib/medals'
import { cn } from '@/lib/utils'

type TUserName = {
	className?: string
	firstName: string | null
	isViewer?: boolean
	lastName: string | null
	userId: number
	stars?: number[] | null
}

export function UserName({
	className,
	isViewer,
	firstName,
	lastName,
	userId,
	stars
}: TUserName) {
	return (
		<Link
			className={cn(
				'inline-flex items-baseline gap-1 truncate',
				isViewer && 'text-orange-400',
				className
			)}
			href={`/users/${userId}`}
		>
			{firstName} {lastName}
			{stars && stars.length > 0 && (
				<span className="inline-flex -translate-y-1 gap-0.5 [&_svg]:size-2.5">
					{stars.filter(Boolean).map((type, i) => {
						const medalColor = getMedalColorHex(type)
						return <StarIcon key={i} fill={medalColor} stroke={medalColor} />
					})}
				</span>
			)}
		</Link>
	)
}
