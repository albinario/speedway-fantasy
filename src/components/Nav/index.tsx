import Link from 'next/link'

import { navItems, type TNavItem } from '@/config/nav'

const NavItemList = ({ items }: { items: TNavItem[] }) => (
	<ul className="flex justify-center gap-4">
		{items.map((item) => (
			<li key={item.href}>
				<Link href={item.href}>{item.label}</Link>

				{item.children?.length ? <NavItemList items={item.children} /> : null}
			</li>
		))}
	</ul>
)

export function NavFooter() {
	const topLevelItems = Object.values(navItems)

	return (
		<nav className="sticky bottom-0 border-t bg-black/65 p-2 backdrop-blur-sm">
			<NavItemList items={topLevelItems} />
		</nav>
	)
}
