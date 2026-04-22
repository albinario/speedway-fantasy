import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { metaData } from './constants'

export const metadata: Metadata = metaData

export default function RulesPage() {
	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={metaData.title} hideYearSelector />

			<div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>How it works</CardTitle>
					</CardHeader>
					<CardContent>
						<ol className="flex flex-col gap-2">
							{[
								'Pick three (3) riders in each Grand Prix.',
								'Collect the points that your three (3) riders score in each Grand Prix.',
								'You may change your selected riders as many times as you like, up until the start of each Grand Prix.',
								'All rider points are calculated based on heat points, and not according to the official Grand Prix point structure.',
								'The first- and second-placed riders from the qualifying round shall each be awarded three (3) additional points and one (1) additional heat, corresponding to a semi-final win.'
							].map((rule, i) => (
								<li key={i} className="flex gap-3">
									<span className="text-muted-foreground w-4 shrink-0 text-right text-sm tabular-nums">
										{i + 1}.
									</span>
									<span className="text-sm">{rule}</span>
								</li>
							))}
						</ol>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Heat points</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y">
							{[
								{ position: 'Winner', points: 3 },
								{ position: '2nd', points: 2 },
								{ position: '3rd', points: 1 },
								{ position: '4th', points: 0 }
							].map(({ position, points }) => (
								<div
									key={position}
									className="flex items-center justify-between px-3 py-2.5"
								>
									<span className="text-sm">{position}</span>
									<span className="text-muted-foreground text-sm tabular-nums">
										{points} pts
									</span>
								</div>
							))}
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

				<Card>
					<CardHeader>
						<CardTitle>Standings sorting order</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y">
							{[
								{ label: 'Total Points' },
								{ label: 'GP Wins' },
								{ label: '2nd places' },
								{ label: '3rd places' },
								{ label: 'Finished heats' }
							].map(({ label }, i) => {
								return (
									<div
										key={i}
										className="flex items-center justify-between px-3 py-2.5"
									>
										<span className="text-muted-foreground text-sm tabular-nums">
											{i + 1}
										</span>
										<span className="flex items-center gap-1.5 text-sm">
											{label}
										</span>
									</div>
								)
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
