'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

import {
	Bandage,
	Coins,
	EyeOff,
	Layers,
	Lock,
	type LucideIcon,
	RefreshCw,
	Repeat,
	Users
} from 'lucide-react'

import {
	Card,
	CardContent,
	CardDescription,
	CardGlow,
	CardHeader
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { SectionTitle } from '../SectionHeader'

const highlights = [
	{ icon: Coins, key: 'budget' },
	{ icon: Users, key: 'riderPicks' },
	{ icon: Layers, key: 'priceTiers' },
	{ icon: Repeat, key: 'keepTeam' },
	{ icon: RefreshCw, key: 'transferWindow' },
	{ icon: Lock, key: 'lockedPrice' },
	{ icon: Bandage, key: 'injuries' },
	{ icon: EyeOff, key: 'privateTrades' }
] as const satisfies { icon: LucideIcon; key: string }[]

export function Season2027AnnouncementCard() {
	const t = useTranslations('Season2027')

	return (
		<div>
			<SectionTitle>
				{t.rich('heading', {
					year: (chunks) => <span className="text-blue-400">{chunks}</span>
				})}
			</SectionTitle>

			<Card className="relative isolate">
				<CardGlow color="blue" position="top" />

				<CardHeader>
					<CardDescription>{t('title')}</CardDescription>
				</CardHeader>

				<CardContent>
					<ol className="flex flex-col gap-3">
						{highlights.map(({ icon: Icon, key }, i) => (
							<li
								key={key}
								className={cn(
									'animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex gap-3 duration-500'
								)}
								style={{ animationDelay: `${i * 75}ms` }}
							>
								<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-blue-400">
									<Icon className="size-3.5" />
								</span>

								<span className="pt-1 text-sm">
									<strong>{t(`${key}.label`)}: </strong>
									{t(`${key}.text`)}
								</span>
							</li>
						))}
					</ol>

					<p className="text-muted-foreground pt-3 text-xs">
						{t.rich('rulesLink', {
							link: (chunks) => (
								<Link
									href="/rules"
									className="text-blue-400 underline underline-offset-2"
								>
									{chunks}
								</Link>
							)
						})}
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
