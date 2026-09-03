import type { Metadata } from 'next'
import Image from 'next/image'

import { Beer, CreditCard } from 'lucide-react'

import { LangToggle } from '@/components/LangToggle'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { metaData } from './constants'

export const metadata: Metadata = metaData

const content = {
	sv: [
		{
			text: 'Speedway Fantasy är ett hjärteprojekt - ett spel som är gratis att spela och alltid kommer att vara det. Alla ska kunna vara med!'
		},
		{
			text: 'Men även om spelet är gratis kostar det en hel del att driva. Servrar, domäner, utvecklingsverktyg och många timmars arbete ligger bakom det du ser.'
		},
		{
			text: 'Om du tycker att spelet är kul och vill visa ditt stöd, så har du här möjligheten att "bjuda mig på en bärs". En liten gest som betyder mycket och hjälper mig att hålla spelet vid liv och fortsätta utveckla det!'
		},
		{
			text: 'Självklart är detta helt frivilligt - spelet kommer alltid att finnas kvar oavsett. Målet är inte att tjäna pengar - det är att öka intresset för sporten. Men all support tas emot med ett stort tack!'
		},
		{
			text: 'Tack för att du spelar,\nAlbin',
			muted: true
		}
	],
	en: [
		{
			text: 'Speedway Fantasy is a passion project - a game that is free to play and always will be. Everyone is welcome!'
		},
		{
			text: 'But even though the game is free, it costs quite a bit to run. Servers, domains, development tools and many hours of work are behind what you see.'
		},
		{
			text: 'If you enjoy the game and want to show your support, you have the opportunity here to "buy me a beer". A small gesture that means a lot and helps me keep the game alive and continue developing it!'
		},
		{
			text: 'Of course this is completely voluntary - the game will always be here regardless. The goal is not to make money, it is to grow the sport. But all support is received with a big thank you!'
		},
		{
			text: 'Thanks for playing,\nAlbin',
			muted: true
		}
	]
}

type TBeerPage = {
	searchParams: Promise<{ lang?: string }>
}

export default async function BeerPage({ searchParams }: TBeerPage) {
	const { lang } = await searchParams
	const activeLang = lang === 'en' ? 'en' : 'sv'
	const paragraphs = content[activeLang]

	return (
		<div className="mx-auto flex max-w-lg flex-col gap-4">
			<PageHeader hideYearSelector>
				<span className="flex items-center gap-2 text-xl font-black uppercase">
					{activeLang === 'sv' ? 'Bjud på en bärs' : 'Buy me a beer'}
					<Beer className="size-6" />
				</span>
			</PageHeader>

			<LangToggle lang={activeLang} />

			<Card>
				<CardContent className="flex flex-col gap-4">
					{paragraphs.map(({ text, muted }, i) => (
						<p
							key={i}
							className={cn(
								'leading-relaxed whitespace-pre-line',
								muted && 'text-muted-foreground text-sm'
							)}
						>
							{text}
						</p>
					))}
				</CardContent>
			</Card>

			<div className="flex gap-4">
				<Button asChild className="flex-1" size="lg" variant="outline">
					<a
						href="https://app.swish.nu/1/p/sw/?sw=0739244208&amt=100.00&cur=SEK&msg=Speedway%20Fantasy%20support&edit=amt,msg&src=qr"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							alt="Swish logo"
							className="size-5"
							height={475}
							width={475}
							src="/swish.png"
						/>
						Swish
					</a>
				</Button>

				<Button asChild className="flex-1" size="lg" variant="outline">
					<a
						href="https://revolut.me/albin8v6"
						rel="noopener noreferrer"
						target="_blank"
					>
						<CreditCard className="size-5" />
						{activeLang === 'sv' ? 'Kort' : 'Card'}
					</a>
				</Button>
			</div>

			<Image
				alt="Swish QR code"
				className="mx-auto hidden max-w-xs sm:block"
				height={945}
				width={625}
				src="/beer-swish.png"
			/>
		</div>
	)
}
