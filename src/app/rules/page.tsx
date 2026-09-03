import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import {
	Card,
	CardContent,
	CardGlow,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { getMedalColorStr } from '@/lib/medals'
import { cn } from '@/lib/utils'

import { metaData } from './constants'
import { HowItWorksCard } from './HowItWorksCard'

export const metadata: Metadata = metaData

const heatPoints = [
	{ position: 'Winner', points: 3 },
	{ position: '2nd', points: 2 },
	{ position: '3rd', points: 1 },
	{ position: '4th', points: 0 }
]

const sortingOrder = [
	'Total Points',
	'GP Wins',
	'2nd places',
	'3rd places',
	'Finished heats'
]

export default function RulesPage() {
	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={metaData.title} hideYearSelector />

			<div className="grid items-start gap-4 sm:grid-cols-2">
				<HowItWorksCard />

				<Card className="relative isolate">
					<CardGlow color="green" position="top" />

					<CardHeader>
						<CardTitle>Heat points</CardTitle>
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
										<span className={cn('text-sm', textColor)}>{position}</span>
										<span
											className={cn(
												'text-sm font-bold tabular-nums',
												textColor
											)}
										>
											{points} pts
										</span>
									</div>
								)
							})}
							<div className="text-muted-foreground px-3 py-2.5 text-sm">
								This includes all qualifying heats, semifinals and final
							</div>
							<div className="text-muted-foreground px-3 py-2.5 text-sm">
								The first- and second-placed riders from the qualifying round
								shall each be awarded three (3) additional points and one (1)
								additional heat, corresponding to a semi-final win
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="relative isolate">
					<CardGlow color="green" position="top" />

					<CardHeader>
						<CardTitle>Standings sorting order</CardTitle>
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
									<span className="pt-1 pb-3 text-sm">{label}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
