import { Calculator, RefreshCw, Trophy, Users, Zap } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type THowItWorksCard = {
	hideTitle?: boolean
}

const rules = [
	{
		icon: Users,
		text: 'Pick three (3) riders in each Grand Prix.'
	},
	{
		icon: Trophy,
		text: 'Collect the points that your three (3) riders score in each Grand Prix.'
	},
	{
		icon: RefreshCw,
		text: 'You may change your selected riders as many times as you like, up until the start of each Grand Prix.'
	},
	{
		icon: Calculator,
		text: 'All rider points are calculated based on heat points, and not according to the official Grand Prix point structure.'
	},
	{
		icon: Zap,
		text: 'The first- and second-placed riders from the qualifying round shall each be awarded three (3) additional points and one (1) additional heat, corresponding to a semi-final win.'
	}
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
				<ol className="flex flex-col gap-3">
					{rules.map(({ icon: Icon, text }, i) => (
						<li
							key={i}
							className={cn(
								'animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex gap-3 duration-500'
							)}
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
	)
}
