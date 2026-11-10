import { useTranslations } from 'next-intl'

import { Calculator, RefreshCw, Trophy, Users, Zap } from 'lucide-react'

import {
	Card,
	CardContent,
	CardGlow,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

type THowItWorksCard = {
	hideTitle?: boolean
}

const rules = [
	{
		icon: Users,
		key: 'pick'
	},
	{
		icon: Trophy,
		key: 'collect'
	},
	{
		icon: RefreshCw,
		key: 'change'
	},
	{
		icon: Calculator,
		key: 'calculation'
	},
	{
		icon: Zap,
		key: 'qualifyingBonus'
	}
] as const

export function HowItWorksCard({ hideTitle = false }: THowItWorksCard) {
	const t = useTranslations('Rules')

	return (
		<Card className="relative isolate">
			<CardGlow color="green" position="top" />

			{!hideTitle && (
				<CardHeader>
					<CardTitle>{t('howItWorks')}</CardTitle>
				</CardHeader>
			)}
			<CardContent>
				<ol className="flex flex-col gap-3">
					{rules.map(({ icon: Icon, key }, i) => (
						<li
							key={key}
							className={cn(
								'animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex gap-3 duration-500'
							)}
							style={{ animationDelay: `${i * 75}ms` }}
						>
							<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-orange-400">
								<Icon className="size-3.5" />
							</span>
							<span className="pt-1 text-sm">{t(key)}</span>
						</li>
					))}
				</ol>
			</CardContent>
		</Card>
	)
}
