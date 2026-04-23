'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import { navItems } from '@/config/nav'
import { cn } from '@/lib/utils'

type THeaderNav = {
	viewerId?: number
}

export function HeaderNav({ viewerId }: THeaderNav) {
	const pathname = usePathname()

	const items = navItems.flatMap((item) => {
		if (item.href === '/users') {
			if (!viewerId) return []
			return [{ ...item, href: `/users/${viewerId}` }]
		}
		return [item]
	})

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon-lg">
					<Menu />
				</Button>
			</SheetTrigger>

			<SheetContent side="right" className="w-56">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>

				<nav className="mt-4 flex flex-col gap-1">
					{items.map((item) => {
						const isActive =
							item.href === '/'
								? pathname === '/'
								: pathname.startsWith(item.href)

						return (
							<Button
								key={item.href}
								asChild
								className={cn('justify-start', isActive && 'text-brand-red')}
								variant="ghost"
							>
								<Link href={item.href}>
									{item.icon && <item.icon />}
									{item.label}
								</Link>
							</Button>
						)
					})}
				</nav>
			</SheetContent>
		</Sheet>
	)
}
