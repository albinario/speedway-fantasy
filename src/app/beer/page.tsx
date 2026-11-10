import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

import { Beer, CreditCard } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getPageMetadata } from '@/i18n/page-metadata'
import { cn } from '@/lib/utils'

export const generateMetadata = () => getPageMetadata('beer')

const paragraphs = [
	'paragraph1',
	'paragraph2',
	'paragraph3',
	'paragraph4',
	'signoff'
] as const

export default async function BeerPage() {
	const t = await getTranslations('Beer')

	return (
		<div className="mx-auto flex max-w-lg flex-col gap-4">
			<PageHeader hideYearSelector>
				<span className="flex items-center gap-2 text-xl font-black uppercase">
					{t('title')}
					<Beer className="size-6" />
				</span>
			</PageHeader>

			<Card>
				<CardContent className="flex flex-col gap-4">
					{paragraphs.map((key) => (
						<p
							key={key}
							className={cn(
								'leading-relaxed whitespace-pre-line',
								key === 'signoff' && 'text-muted-foreground text-sm'
							)}
						>
							{t(key)}
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
							alt={t('swishLogo')}
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
						{t('card')}
					</a>
				</Button>
			</div>

			<Image
				alt={t('swishQr')}
				className="mx-auto hidden max-w-xs sm:block"
				height={945}
				width={625}
				src="/beer-swish.png"
			/>
		</div>
	)
}
