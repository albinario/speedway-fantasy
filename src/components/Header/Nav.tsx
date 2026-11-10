'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LogOut, Menu } from 'lucide-react'
import { VisuallyHidden } from 'radix-ui'

import { LocaleSelector } from '@/components/LocaleSelector'
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

function CreditLink({
	href,
	children
}: {
	href: string
	children: React.ReactNode
}) {
	return (
		<a
			className="underline"
			href={href}
			rel="noopener noreferrer"
			target="_blank"
		>
			{children}
		</a>
	)
}

type THeaderNav = {
	viewerId?: number
	reminder?: boolean
}

export function HeaderNav({ viewerId, reminder }: THeaderNav) {
	const pathname = usePathname()
	const t = useTranslations('Nav')

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
					<SheetTitle>{t('menuTitle')}</SheetTitle>
				</VisuallyHidden.Root>
				<VisuallyHidden.Root asChild>
					<SheetDescription>{t('menuDescription')}</SheetDescription>
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
										{t(item.labelKey)}
									</Link>
								</Button>
							</SheetClose>
						)
					})}
				</nav>

				<div className="mt-auto flex flex-col gap-4 p-4">
					<LocaleSelector />

					{!!viewerId && (
						<>
							<ReminderToggle defaultChecked={reminder ?? false} />

							<SheetClose asChild>
								<Button asChild variant="destructive">
									<a href="/auth/logout">
										{t('logOut')}
										<LogOut />
									</a>
								</Button>
							</SheetClose>
						</>
					)}

					<div className="text-muted-foreground flex flex-col gap-1 text-xs opacity-50">
						<p>© {new Date().getFullYear()} Speedway Fantasy.</p>
						<p>
							{t.rich('developedBy', {
								link: (chunks) => (
									<CreditLink href="https://github.com/albinario">
										{chunks}
									</CreditLink>
								)
							})}
						</p>
						<p>
							{t.rich('designedBy', {
								albin: (chunks) => (
									<CreditLink href="https://www.linkedin.com/in/albinlindeborg/">
										{chunks}
									</CreditLink>
								),
								pablo: (chunks) => (
									<CreditLink href="https://www.linkedin.com/in/pablosuzarte">
										{chunks}
									</CreditLink>
								),
								alexa: (chunks) => (
									<CreditLink href="https://www.alexaraducanu.com">
										{chunks}
									</CreditLink>
								)
							})}
						</p>
						<p>{t('rightsReserved')}</p>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
