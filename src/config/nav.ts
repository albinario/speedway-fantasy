export type TNavItem = {
	label: string
	href: string
	children?: TNavItem[]
}

export const navItems: TNavItem[] = [
	{ label: 'Home', href: '/' },
	{
		label: 'Riders',
		href: '/riders',
		children: [
			{
				label: 'Points',
				href: '/riders/points'
			}
		]
	},
	{ label: 'Input', href: '/test/input' },
	{ label: 'Users', href: '/users' },
	{ label: 'Comments', href: '/comments' },
	{ label: "GP's", href: '/gps' },
	{
		label: 'Library',
		href: '/library',
		children: [{ label: 'GP Cards', href: '/library/gp-card' }]
	}
]
