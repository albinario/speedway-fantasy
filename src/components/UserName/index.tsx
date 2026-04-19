import Link from 'next/link'

import { StarIcon } from 'lucide-react'

import { getMedalColorHex } from '@/lib/medals'
import { cn } from '@/lib/utils'

type TUserName = {
	className?: string
	firstName: string | null
	lastName: string | null
	isViewer?: boolean
	stars?: number[] | null
	userId: number
}

export function UserName({
	className,
	firstName,
	lastName,
	isViewer = false,
	stars,
	userId
}: TUserName) {
	return (
		<Link
			className={cn(
				'inline-flex items-start gap-0.5 truncate',
				isViewer && 'text-orange-400',
				className
			)}
			href={`/users/${userId}`}
		>
			{firstName} {lastName}
			{stars && stars.length > 0 && (
				<span className="mt-0.25 inline-flex gap-0.5 [&_svg]:size-2.5">
					{stars.filter(Boolean).map((type, i) => {
						const medalColor = getMedalColorHex(type)
						return <StarIcon key={i} fill={medalColor} stroke={medalColor} />
					})}
				</span>
			)}
		</Link>
	)
}
