import { getTranslations } from 'next-intl/server'

import { PageHeader } from '@/components/PageHeader'
import {
	Card,
	CardContent,
	CardGlow,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { getPageMetadata } from '@/i18n/page-metadata'
import { getMedalColorStr } from '@/lib/medals'
import { cn } from '@/lib/utils'

import { HowItWorksCard } from './HowItWorksCard'

export const generateMetadata = () => getPageMetadata('rules')

const heatPoints = [
	{ position: 'heatWinner', points: 3 },
	{ position: 'heatSecond', points: 2 },
	{ position: 'heatThird', points: 1 },
	{ position: 'heatFourth', points: 0 }
] as const

// Always 16 riders per GP, split into 5 tiers by odds (see 2027 budget doc)
const priceTiers = [
	{ coins: 5, from: 1, to: 3 },
	{ coins: 4, from: 4, to: 6 },
	{ coins: 3, from: 7, to: 9 },
	{ coins: 2, from: 10, to: 12 },
	{ coins: 1, from: 13, to: 16 }
] as const

const sortingOrder = [
	'sortPoints',
	'sortWins',
	'sortSecond',
	'sortThird',
	'sortHeats'
] as const

export default async function RulesPage() {
	const [tPages, t] = await Promise.all([
		getTranslations('Pages'),
		getTranslations('Rules')
	])

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={tPages('rules.title')} hideYearSelector />

			<div className="columns-1 gap-4 sm:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid">
				<HowItWorksCard />

				<Card className="relative isolate">
					<CardGlow color="green" position="top" />

					<CardHeader>
						<CardTitle>{t('priceTiers')}</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y">
							{priceTiers.map(({ coins, from, to }, i) => (
								<div
									key={coins}
									className={cn(
										'animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-center justify-between px-3 py-2.5 duration-500'
									)}
									style={{ animationDelay: `${i * 75}ms` }}
								>
									<span className="text-sm">
										{t('tierRiders', { from, to })}
									</span>
									<span className="text-sm font-bold text-orange-400 tabular-nums">
										{t('tierCoins', { coins })}
									</span>
								</div>
							))}
							<div className="text-muted-foreground px-3 py-2.5 text-sm">
								{t('tierFieldSize')}
							</div>
							<div className="text-muted-foreground px-3 py-2.5 text-sm">
								{t('tierOdds')}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="relative isolate">
					<CardGlow color="green" position="top" />

					<CardHeader>
						<CardTitle>{t('heatPoints')}</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y">
							{heatPoints.map(({ position, points }, i) => {
								const textColor =
									getMedalColorStr(i + 1, 'text') ?? 'text-muted-foreground'

								return (
									<div
										key={position}
										className={cn(
											'animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-center justify-between px-3 py-2.5 duration-500'
										)}
										style={{ animationDelay: `${i * 75}ms` }}
									>
										<span className={cn('text-sm', textColor)}>
											{t(position)}
										</span>
										<span
											className={cn(
												'text-sm font-bold tabular-nums',
												textColor
											)}
										>
											{t('heatPointsValue', { points })}
										</span>
									</div>
								)
							})}
							<div className="text-muted-foreground px-3 py-2.5 text-sm">
								{t('allHeats')}
							</div>
							<div className="text-muted-foreground px-3 py-2.5 text-sm">
								{t('qualifyingBonus')}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="relative isolate">
					<CardGlow color="green" position="top" />

					<CardHeader>
						<CardTitle>{t('sortingOrder')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col">
							{sortingOrder.map((label, i) => (
								<div
									key={label}
									className={cn(
										'animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex gap-3 duration-500'
									)}
									style={{ animationDelay: `${i * 75}ms` }}
								>
									<div className="flex flex-col items-center">
										<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-sm font-bold text-orange-400 tabular-nums">
											{i + 1}
										</span>
										{i < sortingOrder.length - 1 && (
											<div className="bg-border my-1 w-px flex-1" />
										)}
									</div>
									<span className="pt-1 pb-3 text-sm">{t(label)}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
