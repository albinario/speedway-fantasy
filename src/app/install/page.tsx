import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { Check, MoreVertical, Share, SquarePlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

import { metaData } from './constants'
import { OsToggle } from './OsToggle'

export const metadata: Metadata = metaData

type TOs = 'ios' | 'android'

const steps: Record<TOs, { icon: LucideIcon; text: string }[]> = {
	ios: [
		{
			icon: Share,
			text: "Tap the Share icon in Safari's toolbar (the square with an arrow pointing up)."
		},
		{
			icon: SquarePlus,
			text: 'Scroll down the share menu and tap "Add to Home Screen".'
		},
		{
			icon: Check,
			text: 'Tap "Add" in the top-right corner to confirm.'
		}
	],
	android: [
		{
			icon: MoreVertical,
			text: 'Tap the three-dot menu in the top-right corner of Chrome.'
		},
		{
			icon: SquarePlus,
			text: 'Tap "Add to Home screen" (sometimes shown as "Install app").'
		},
		{
			icon: Check,
			text: 'Tap "Add" or "Install" to confirm.'
		}
	]
}

function detectOs(userAgent: string): TOs {
	return /android/i.test(userAgent) ? 'android' : 'ios'
}

type TInstallPage = {
	searchParams: Promise<{ os?: string }>
}

export default async function InstallPage({ searchParams }: TInstallPage) {
	const [{ os }, headersList] = await Promise.all([searchParams, headers()])
	const activeOs: TOs =
		os === 'ios' || os === 'android'
			? os
			: detectOs(headersList.get('user-agent') ?? '')

	return (
		<div className="mx-auto flex max-w-lg flex-col gap-4">
			<PageHeader title={metaData.title} hideYearSelector />

			<OsToggle os={activeOs} />

			<Card>
				<CardContent className="flex flex-col gap-4">
					<p className="text-muted-foreground text-sm leading-relaxed">
						Speedway Fantasy works right from your browser - no app store
						needed. Add it to your home screen for quick access and a
						full-screen, app-like experience.
					</p>

					<ol className="flex flex-col gap-3">
						{steps[activeOs].map(({ icon: Icon, text }, i) => (
							<li
								key={i}
								className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex gap-3 duration-500"
								style={{ animationDelay: `${i * 75}ms` }}
							>
								<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-orange-400">
									<Icon className="size-3.5" />
								</span>
								<span className="pt-1 text-sm">{text}</span>
							</li>
						))}
					</ol>
				</CardContent>
			</Card>
		</div>
	)
}
