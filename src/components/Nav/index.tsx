'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems, type TNavItem } from '@/config/nav'

const NavItemList = ({ items }: { items: TNavItem[] }) => {
	const pathname = usePathname()

	return (
		<ul className="flex justify-center gap-4">
			{items.map((item) => {
				const isActive =
					item.href === '/'
						? pathname === '/'
						: pathname.startsWith(item.href)

				return (
					<li key={item.href}>
						<Link
							href={item.href}
							className={`flex flex-col items-center gap-1 text-sm leading-tight transition-colors hover:text-foreground ${isActive ? 'text-shale' : 'text-muted-foreground'}`}
						>
							{item.icon && <item.icon size={18} />}
							{item.label}
						</Link>

						{item.children?.length ? (
							<NavItemList items={item.children} />
						) : null}
					</li>
				)
			})}
		</ul>
	)
}

export function NavFooter() {
	const topLevelItems = Object.values(navItems)

	return (
		<nav className="sticky bottom-0 z-50 border-t bg-black/65 p-2 p-4 backdrop-blur-sm">
			<NavItemList items={topLevelItems} />
		</nav>
	)
}
