'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LogOut, Menu } from 'lucide-react'
import { VisuallyHidden } from 'radix-ui'

import { ReminderToggle } from '@/components/ReminderToggle'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'
import { navItems } from '@/config/nav'
import { cn } from '@/lib/utils'

type THeaderNav = {
	viewerId?: number
	reminder?: boolean
}

export function HeaderNav({ viewerId, reminder }: THeaderNav) {
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

			<SheetContent side="right" className="flex w-56 flex-col pt-6">
				<VisuallyHidden.Root asChild>
					<SheetTitle>Navigation menu</SheetTitle>
				</VisuallyHidden.Root>
				<VisuallyHidden.Root asChild>
					<SheetDescription>
						Links to the main sections of Speedway Fantasy
					</SheetDescription>
				</VisuallyHidden.Root>

				<nav className="mt-4 flex flex-col gap-1">
					{items.map((item) => {
						const isActive =
							item.href === '/'
								? pathname === '/'
								: pathname.startsWith(item.href)

						return (
							<SheetClose key={item.href} asChild>
								<Button
									asChild
									className={cn('justify-start', isActive && 'text-brand-red')}
									variant="ghost"
								>
									<Link href={item.href}>
										{item.icon && <item.icon />}
										{item.label}
									</Link>
								</Button>
							</SheetClose>
						)
					})}
				</nav>

				<div className="mt-auto flex flex-col gap-4 p-4">
					{!!viewerId && (
						<>
							<ReminderToggle defaultChecked={reminder ?? false} />

							<SheetClose asChild>
								<Button asChild variant="destructive">
									<a href="/auth/logout">
										Log out
										<LogOut />
									</a>
								</Button>
							</SheetClose>
						</>
					)}

					<div className="text-muted-foreground flex flex-col gap-1 text-xs opacity-50">
						<p>© {new Date().getFullYear()} Speedway Fantasy.</p>
						<p>
							Developed by{' '}
							<a
								className="underline"
								href="https://github.com/albinario"
								rel="noopener noreferrer"
								target="_blank"
							>
								Albin Lindeborg
							</a>
							.
						</p>
						<p>
							Designed by{' '}
							<a
								className="underline"
								href="https://www.linkedin.com/in/albinlindeborg/"
								rel="noopener noreferrer"
								target="_blank"
							>
								Albin Lindeborg
							</a>
							,{' '}
							<a
								className="underline"
								href="https://www.linkedin.com/in/pablosuzarte"
								rel="noopener noreferrer"
								target="_blank"
							>
								Pablo Suzarte
							</a>{' '}
							and{' '}
							<a
								className="underline"
								href="https://www.alexaraducanu.com"
								rel="noopener noreferrer"
								target="_blank"
							>
								Alexa Raducanu
							</a>
							.
						</p>
						<p>All rights reserved.</p>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
