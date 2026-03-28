import Link from 'next/link'

import { StarIcon } from 'lucide-react'

import { getMedalColor } from '@/lib/medals'

type TUsersName = {
	firstName: string | null
	lastName: string | null
	stars?: number[] | null
	userId: string
}

export function UsersName({ userId, firstName, lastName, stars }: TUsersName) {
	return (
		<Link
			className="inline-flex items-baseline gap-1 text-xs uppercase sm:text-sm"
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
