import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type THowItWorksCard = {
	hideTitle?: boolean
}

const rules = [
	'Pick three (3) riders in each Grand Prix.',
	'Collect the points that your three (3) riders score in each Grand Prix.',
	'You may change your selected riders as many times as you like, up until the start of each Grand Prix.',
	'All rider points are calculated based on heat points, and not according to the official Grand Prix point structure.',
	'The first- and second-placed riders from the qualifying round shall each be awarded three (3) additional points and one (1) additional heat, corresponding to a semi-final win.'
]

export function HowItWorksCard({ hideTitle = false }: THowItWorksCard) {
	return (
		<Card>
			{!hideTitle && (
				<CardHeader>
					<CardTitle>How it works</CardTitle>
				</CardHeader>
			)}
			<CardContent>
				<ol className="flex flex-col gap-2">
					{rules.map((rule, i) => (
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
	)
}
