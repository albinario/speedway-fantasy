'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems } from '@/config/nav'
import { cn } from '@/lib/utils'

type TNavFooter = {
	viewerId?: number
	unreadComments?: number
}

export function NavFooter({ viewerId, unreadComments = 0 }: TNavFooter) {
	const pathname = usePathname()

	const items = navItems.map((item) => {
		if (item.href === '/users') {
			return viewerId
				? { ...item, href: `/users/${viewerId}` }
				: { ...item, label: 'Log in', href: '/auth/login' }
		}
		return item
	})

	return (
		<nav className="sticky bottom-0 z-50 border-t bg-black/65 p-4 backdrop-blur-sm">
			<ul className="flex justify-center gap-4">
				{items.map((item) => {
					const isActive =
						item.href === '/'
							? pathname === '/'
							: pathname.startsWith(item.href)

					return (
						<li
							key={item.href}
							className={item.showOnMobile ? undefined : 'hidden sm:block'}
						>
							<Link
								href={item.href}
								className={cn(
									'hover:text-foreground flex flex-col items-center gap-1 text-sm leading-tight transition-colors',
									isActive ? 'text-brand-red' : 'text-muted-foreground'
								)}
							>
								{item.icon && (
									<span className="relative">
										<item.icon size={18} />
										{item.href === '/comments' &&
											unreadComments > 0 &&
											!isActive && (
												<span className="bg-brand-red absolute -top-1 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[9px] leading-none text-white">
													{unreadComments > 99 ? '99+' : unreadComments}
												</span>
											)}
									</span>
								)}
								<span className="w-full truncate text-center">
									{item.label}
								</span>
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
