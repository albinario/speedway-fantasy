import { cn } from '@/lib/utils'

type TUserAvatar = {
	className?: string
	firstName?: string | null
	lastName?: string | null
}

export function UserAvatar({ className, firstName, lastName }: TUserAvatar) {
	const initials = [firstName, lastName]
		.filter(Boolean)
		.map((n) => n![0])
		.join('')
		.toUpperCase()

	return (
		<span
			className={cn(
				'inline-flex shrink-0 items-center justify-center rounded-full bg-white/10 font-bold',
				className
			)}
		>
			{initials}
		</span>
	)
}
