import {
	Flag,
	House,
	ListOrdered,
	MessagesSquare,
	Motorbike
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type TNavItem = {
	label: string
	href: string
	icon?: LucideIcon
	children?: TNavItem[]
}

export const navItems: TNavItem[] = [
	{ label: 'Home', href: '/', icon: House },
	{ label: 'Standings', href: '/standings', icon: ListOrdered },
	{ label: 'Riders', href: '/riders', icon: Motorbike },
	// { label: 'Input', href: '/test/input' },
	// { label: 'Users', href: '/users' },
	{ label: 'Comments', href: '/comments', icon: MessagesSquare },
	{ label: "GP's", href: '/gps', icon: Flag }
	// {
	// 	label: 'Library',
	// 	href: '/library',
	// 	children: [{ label: 'GP Cards', href: '/library/gp-card' }]
	// }
]
