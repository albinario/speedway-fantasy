'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems } from '@/config/nav'
import { cn } from '@/lib/utils'

type TNavFooter = {
	viewerId?: number
}

export function NavFooter({ viewerId }: TNavFooter) {
	const pathname = usePathname()

	const items = navItems.map((item) => {
		if (item.href === '/users/:id') {
			return viewerId
				? { ...item, href: `/users/${viewerId}` }
				: { ...item, label: 'Log in', href: '/auth/login' }
		}
		return item
	})

	return (
		<nav className="sticky bottom-0 z-50 border-t bg-black/65 p-4 backdrop-blur-sm">
			<ul className="flex justify-center gap-4">
				{items
					.filter((item) => !item.hideOnMobile)
					.map((item) => {
						const isActive =
							item.href === '/'
								? pathname === '/'
								: pathname.startsWith(item.href)

						return (
							<li key={item.href}>
								<Link
									href={item.href}
									className={cn(
										'hover:text-foreground flex flex-col items-center gap-1 text-sm leading-tight transition-colors',
										isActive ? 'text-brand-red' : 'text-muted-foreground'
									)}
								>
									{item.icon && <item.icon size={18} />}
									{item.label}
								</Link>
							</li>
						)
					})}
			</ul>
		</nav>
	)
}
