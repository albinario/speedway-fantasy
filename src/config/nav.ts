import {
	Beer,
	BookOpen,
	Flag,
	House,
	ListCheck,
	ListOrdered,
	MessagesSquare,
	SquarePlus,
	Trophy,
	UserIcon
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { TMessages } from '@/i18n/messages/en'

export type TNavItem = {
	labelKey: keyof TMessages['Nav']
	href: string
	icon?: LucideIcon
	showOnMobile?: boolean
}

export const navItems: TNavItem[] = [
	{
		labelKey: 'home',
		href: '/',
		icon: House,
		showOnMobile: true
	},
	{
		labelKey: 'standings',
		href: '/standings',
		icon: ListOrdered,
		showOnMobile: true
	},
	{
		labelKey: 'gps',
		href: '/gps',
		icon: Flag,
		showOnMobile: true
	},
	{
		labelKey: 'comments',
		href: '/comments',
		icon: MessagesSquare,
		showOnMobile: true
	},
	{
		labelKey: 'activity',
		href: '/activity',
		icon: ListCheck
	},
	{
		labelKey: 'hallOfFame',
		href: '/hall-of-fame',
		icon: Trophy
	},
	{
		labelKey: 'rules',
		href: '/rules',
		icon: BookOpen
	},
	{
		labelKey: 'install',
		href: '/install',
		icon: SquarePlus
	},
	{
		labelKey: 'beer',
		href: '/beer',
		icon: Beer
	},
	{
		labelKey: 'myPage',
		href: '/users',
		icon: UserIcon,
		showOnMobile: true
	}
]
