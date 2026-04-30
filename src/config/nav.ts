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
	showOnMobile?: boolean
}

export const navItems: TNavItem[] = [
	{
		label: 'Home',
		href: '/',
		icon: House,
		showOnMobile: true
	},
	{
		label: "GP's",
		href: '/gps',
		icon: Flag,
		showOnMobile: true
	},
	{
		label: 'Standings',
		href: '/standings',
		icon: ListOrdered,
		showOnMobile: true
	},
	{
		label: 'Comments',
		href: '/comments',
		icon: MessagesSquare,
		showOnMobile: true
	},
	{
		label: 'Hall of fame',
		href: '/hall-of-fame',
		icon: Trophy
	},
	{
		label: 'Rules',
		href: '/rules',
		icon: BookOpen
	},
	{
		label: 'Beer',
		href: '/beer',
		icon: Beer
	},
	{
		label: 'My page',
		href: '/users',
		icon: UserIcon,
		showOnMobile: true
	}
]
