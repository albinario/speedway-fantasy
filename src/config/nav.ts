import {
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
	hideOnMobile?: boolean
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
		label: 'My page',
		href: '/users/:id',
		icon: UserIcon
	},
	{
		label: 'Hall of fame',
		href: '/hall-of-fame',
		icon: Trophy,
		hideOnMobile: true
	},
	{
		label: 'Rules',
		href: '/rules',
		icon: BookOpen,
		hideOnMobile: true
	}
]
