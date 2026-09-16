'use client'

import { useSearchParams } from 'next/navigation'

import {
	Coins,
	EyeOff,
	Layers,
	Lock,
	type LucideIcon,
	RefreshCw,
	Repeat,
	Users
} from 'lucide-react'

import { LangToggle, type TLang } from '@/components/LangToggle'
import {
	Card,
	CardContent,
	CardDescription,
	CardGlow,
	CardHeader
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { SectionTitle } from '../SectionHeader'

const title: Record<TLang, string> = {
	en: 'Speedway Fantasy takes the next step — a budget system for building your team.',
	sv: 'Nu tar Speedway Fantasy nästa steg — ett budgetsystem för att sätta ditt lag.'
}

const highlights: {
	icon: LucideIcon
	label?: Partial<Record<TLang, string>>
	text: Record<TLang, string>
}[] = [
	{
		icon: Coins,
		label: { en: 'Budget', sv: 'Budget' },
		text: {
			en: "You'll have 10 coins to spend before each GP.",
			sv: 'Inför varje GP har du 10 coins att spendera.'
		}
	},
	{
		icon: Users,
		label: { en: 'Rider picks', sv: 'Val av förare' },
		text: {
			en: "You'll still pick three riders, but their combined cost must fit within your budget.",
			sv: 'Du väljer fortfarande tre förare, men deras sammanlagda kostnad måste rymmas inom budgeten.'
		}
	},
	{
		icon: Layers,
		label: { en: 'Price tiers', sv: 'Prisnivåer' },
		text: {
			en: 'Riders are split into five tiers — 5, 4, 3, 2 and 1 coin. The three highest-ranked riders cost 5 coins, the next three cost 4, and so on. The four lowest-ranked riders cost 1 coin.',
			sv: 'Förarna delas in i fem nivåer — 5, 4, 3, 2 och 1 coin. De tre högst rankade kostar 5 coins, nästa tre kostar 4, och så vidare. De fyra lägst rankade kostar 1 coin.'
		}
	},
	{
		icon: Repeat,
		label: { en: 'Keep your team', sv: 'Behåll ditt lag' },
		text: {
			en: "If you don't make any changes, your riders automatically carry over to the next GP.",
			sv: 'Gör du inga ändringar följer dina förare automatiskt med till nästa GP.'
		}
	},
	{
		icon: RefreshCw,
		label: { en: 'Transfer window', sv: 'Transferfönster' },
		text: {
			en: 'After each GP, prices update and a new transfer window opens. Trade as much as you like until the next GP starts — just like today.',
			sv: 'Efter varje GP uppdateras priserna och ett nytt transferfönster öppnas. Byt så mycket du vill fram tills nästa GP startar — precis som idag.'
		}
	},
	{
		icon: Lock,
		label: { en: 'Locked price', sv: 'Låst pris' },
		text: {
			en: "The price you pay for a rider is locked in. Even if the rider's value changes later, you'll keep them at the same price.",
			sv: 'Priset du betalar för en förare låses fast. Även om förarens värde ändras senare behåller du föraren till samma pris.'
		}
	},
	{
		icon: EyeOff,
		label: { en: 'Private trades', sv: 'Hemliga byten' },
		text: {
			en: 'Your trades are private until picks lock when the GP starts — just like today.',
			sv: 'Dina byten är privata tills valen låses när GP:t startar — precis som idag.'
		}
	}
]

const tbdNote: Record<TLang, string> = {
	en: 'Exactly how the price tiers are calculated is still being worked on and will be clarified before the 2027 season begins.',
	sv: 'Exakt hur beräkningen av prisnivåerna går till är fortfarande under arbete och kommer att förtydligas innan säsongen 2027 drar igång.'
}

export function Season2027AnnouncementCard() {
	const searchParams = useSearchParams()
	const lang: TLang = searchParams.get('lang') === 'en' ? 'en' : 'sv'

	return (
		<div>
			<SectionTitle>
				Big changes coming in <span className="text-blue-400">2027</span>
			</SectionTitle>

			<Card className="relative isolate">
				<CardGlow color="blue" position="top" />

				<div className="p-2">
					<LangToggle lang={lang} />
				</div>

				<CardHeader>
					<CardDescription>{title[lang]}</CardDescription>
				</CardHeader>

				<CardContent>
					<ol className="flex flex-col gap-3">
						{highlights.map(({ icon: Icon, label, text }, i) => (
							<li
								key={i}
								className={cn(
									'animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex gap-3 duration-500'
								)}
								style={{ animationDelay: `${i * 75}ms` }}
							>
								<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-blue-400">
									<Icon className="size-3.5" />
								</span>

								<span className="pt-1 text-sm">
									{label?.[lang] && <strong>{label[lang]}: </strong>}
									{text[lang]}
								</span>
							</li>
						))}
					</ol>

					<p className="text-muted-foreground pt-3 text-xs">{tbdNote[lang]}</p>
				</CardContent>
			</Card>
		</div>
	)
}
