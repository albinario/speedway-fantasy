import {
	Beer,
	BookOpen,
	Flag,
	House,
	ListOrdered,
	MessagesSquare,
	Trophy,
	UserIcon
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type TNavItem = {
	label: string
	href: string
	icon?: LucideIcon
	hideInFooter?: boolean
}

export const navItems: TNavItem[] = [
	{
		label: 'Home',
		href: '/',
		icon: House
	},
	{
		label: "GP's",
		href: '/gps',
		icon: Flag
	},
	{
		label: 'Standings',
		href: '/standings',
		icon: ListOrdered
	},
	{
		label: 'Comments',
		href: '/comments',
		icon: MessagesSquare
	},
	{
		label: 'Hall of fame',
		href: '/hall-of-fame',
		icon: Trophy,
		hideInFooter: true
	},
	{
		label: 'Rules',
		href: '/rules',
		icon: BookOpen,
		hideInFooter: true
	},
	{
		label: 'Beer',
		href: '/beer',
		icon: Beer,
		hideInFooter: true
	},
	{
		label: 'My page',
		href: '/users',
		icon: UserIcon
	}
]
