'use client'

import { useSearchParams } from 'next/navigation'

import {
	Coins,
	EyeOff,
	Layers,
	Lock,
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
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { SectionTitle } from '../SectionHeader'

const title: Record<TLang, string> = {
	en: "It's time for Speedway Fantasy to be brought to a whole new level, introducing a budget system for picking your riders.",
	sv: 'Det är dags för Speedway Fantasy att ta klivet till nästa nivå — ett budgetsystem införs för att välja dina förare.'
}

const highlights = [
	{
		icon: Coins,
		text: {
			en: "Each Grand Prix, you'll have a 10-coin budget to spend.",
			sv: 'Inför varje GP har du en budget på 10 coins att spendera.'
		}
	},
	{
		icon: Users,
		text: {
			en: "You'll still pick three (3) riders — but now their combined cost must fit your budget.",
			sv: 'Du väljer fortfarande tre (3) förare — men nu måste deras sammanlagda kostnad rymmas inom din budget.'
		}
	},
	{
		icon: Layers,
		text: {
			en: 'Riders are split into five price tiers: 5, 4, 3, 2, 1 coins. The three highest-ranked riders cost 5 coins, the next three cost 4, and so on. The four lowest-ranked riders cost 1 coin.',
			sv: 'Förarna delas in i fem prisnivåer: 5, 4, 3, 2, 1 coins. De tre högst rankade förarna kostar 5 coins, nästföljande tre kostar 4, osv. De fyra lägst rankade förarna kostar 1 coin.'
		}
	},
	{
		icon: Repeat,
		text: {
			en: "You get to keep your riders from the previous GP — if you don't make any changes, your picks simply carries over.",
			sv: 'Du får behålla dina förare från föregående GP — gör du inga ändringar följer dina förare helt enkelt med till nästa omgång.'
		}
	},
	{
		icon: RefreshCw,
		text: {
			en: 'After each GP, prices update and a transfer window opens — trade as much as you like until the next GP starts, just like your picks work today.',
			sv: 'Efter varje GP uppdateras priserna och ett transferfönster öppnas — byt så mycket du vill fram tills nästa GP startar, precis som dina val fungerar idag.'
		}
	},
	{
		icon: Lock,
		text: {
			en: "Whatever you pay for a rider is locked in — their value can change later, but you'll keep the rider at the same price.",
			sv: 'Det pris du betalar för en förare låses fast — deras värde kan ändras senare, men du behåller föraren till samma pris.'
		}
	},
	{
		icon: EyeOff,
		text: {
			en: 'Your trades stay private, just like your picks today — nobody sees a move until picks lock when the GP starts.',
			sv: 'Dina byten hålls privata, precis som dina val idag — ingen ser ett drag förrän valen låses när GP:t startar.'
		}
	}
]

const tbdNote: Record<TLang, string> = {
	en: 'The exact calculation of which riders land in which price tier is still being worked on. This will be clarified and announced before the 2027 season begins.',
	sv: 'Exakt hur beräkningen av vilka förare som hamnar i vilken pris-nivå går till är fortfarande under arbete. Detta kommer att förtydligas och meddelas innan 2027 års säsong drar igång.'
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
						{highlights.map(({ icon: Icon, text }, i) => (
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
								<span className="pt-1 text-sm">{text[lang]}</span>
							</li>
						))}
					</ol>

					<p className="text-muted-foreground pt-3 text-xs">{tbdNote[lang]}</p>
				</CardContent>
			</Card>
		</div>
	)
}
