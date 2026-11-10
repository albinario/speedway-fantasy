import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'

import { Check, MoreVertical, Share, SquarePlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardGlow } from '@/components/ui/card'
import { getPageMetadata } from '@/i18n/page-metadata'

import { OsToggle } from './OsToggle'

export const generateMetadata = () => getPageMetadata('install')

type TOs = 'ios' | 'android'

const stepIcons: Record<TOs, LucideIcon[]> = {
	ios: [Share, SquarePlus, Check],
	android: [MoreVertical, SquarePlus, Check]
}

function detectOs(userAgent: string): TOs {
	return /android/i.test(userAgent) ? 'android' : 'ios'
}

type TInstallPage = {
	searchParams: Promise<{ os?: string }>
}

export default async function InstallPage({ searchParams }: TInstallPage) {
	const [{ os }, headersList, t] = await Promise.all([
		searchParams,
		headers(),
		getTranslations('Install')
	])
	const activeOs: TOs =
		os === 'ios' || os === 'android'
			? os
			: detectOs(headersList.get('user-agent') ?? '')

	const steps = stepIcons[activeOs].map((icon, i) => ({
		icon,
		text: t(`${activeOs}.step${(i + 1) as 1 | 2 | 3}`)
	}))

	return (
		<div className="mx-auto flex max-w-lg flex-col gap-4">
			<PageHeader hideYearSelector>
				<span className="text-xl font-black uppercase">{t('title')}</span>
			</PageHeader>

			<Card className="relative isolate">
				<div className="flex flex-col gap-2 p-2">
					<OsToggle os={activeOs} />
				</div>

				<CardGlow color="blue" position="bottom" />

				<CardContent className="flex flex-col gap-4">
					<p className="text-muted-foreground text-sm leading-relaxed">
						{t('intro')}
					</p>

					<ol className="flex flex-col gap-3">
						{steps.map(({ icon: Icon, text }, i) => (
							<li
								key={i}
								className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex gap-3 duration-500"
								style={{ animationDelay: `${i * 75}ms` }}
							>
								<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-blue-400">
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
