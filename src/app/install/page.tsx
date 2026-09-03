import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { Check, MoreVertical, Share, SquarePlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { LangToggle, type TLang } from '@/components/LangToggle'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

import { metaData } from './constants'
import { OsToggle } from './OsToggle'

export const metadata: Metadata = metaData

type TOs = 'ios' | 'android'

const stepIcons: Record<TOs, LucideIcon[]> = {
	ios: [Share, SquarePlus, Check],
	android: [MoreVertical, SquarePlus, Check]
}

const stepText: Record<TOs, Record<TLang, string[]>> = {
	ios: {
		en: [
			"Tap the Share icon in Safari's toolbar (the square with an arrow pointing up).",
			'Scroll down the share menu and tap "Add to Home Screen".',
			'Tap "Add" in the top-right corner to confirm.'
		],
		sv: [
			'Tryck på delningsikonen i Safaris verktygsfält (kvadraten med en pil som pekar uppåt).',
			'Scrolla ner i delningsmenyn och tryck på "Lägg till på hemskärmen".',
			'Tryck på "Lägg till" i det övre högra hörnet för att bekräfta.'
		]
	},
	android: {
		en: [
			'Tap the three-dot menu in the top-right corner of Chrome.',
			'Tap "Add to Home screen" (sometimes shown as "Install app").',
			'Tap "Add" or "Install" to confirm.'
		],
		sv: [
			'Tryck på menyn med tre punkter i Chromes övre högra hörn.',
			'Tryck på "Lägg till på hemskärmen" (visas ibland som "Installera app").',
			'Tryck på "Lägg till" eller "Installera" för att bekräfta.'
		]
	}
}

const intro: Record<TLang, string> = {
	en: 'Speedway Fantasy works right from your browser - no App store needed. Add it to your home screen for quick access and a full-screen, app-like experience.',
	sv: 'Speedway Fantasy fungerar direkt i din webbläsare - ingen App store behövs. Lägg till den på hemskärmen för snabb åtkomst och en helskärms- och app-liknande upplevelse.'
}

const title: Record<TLang, string> = {
	en: 'Install app',
	sv: 'Installera app'
}

function detectOs(userAgent: string): TOs {
	return /android/i.test(userAgent) ? 'android' : 'ios'
}

type TInstallPage = {
	searchParams: Promise<{ os?: string; lang?: string }>
}

export default async function InstallPage({ searchParams }: TInstallPage) {
	const [{ os, lang }, headersList] = await Promise.all([
		searchParams,
		headers()
	])
	const activeOs: TOs =
		os === 'ios' || os === 'android'
			? os
			: detectOs(headersList.get('user-agent') ?? '')
	const activeLang: TLang = lang === 'en' ? 'en' : 'sv'

	const steps = stepIcons[activeOs].map((icon, i) => ({
		icon,
		text: stepText[activeOs][activeLang][i]
	}))

	return (
		<div className="mx-auto flex max-w-lg flex-col gap-4">
			<PageHeader hideYearSelector>
				<span className="text-xl font-black uppercase">
					{title[activeLang]}
				</span>
			</PageHeader>

			<OsToggle os={activeOs} />
			<LangToggle lang={activeLang} />

			<Card>
				<CardContent className="flex flex-col gap-4">
					<p className="text-muted-foreground text-sm leading-relaxed">
						{intro[activeLang]}
					</p>

					<ol className="flex flex-col gap-3">
						{steps.map(({ icon: Icon, text }, i) => (
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
