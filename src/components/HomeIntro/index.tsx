import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { LogIn, TrendingUp, Trophy, Users } from 'lucide-react'

import { SectionTitle } from '@/components/SectionHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardGlow } from '@/components/ui/card'
import { accent } from '@/i18n/rich'

const features = [
	{ icon: Users, key: 'featurePick' },
	{ icon: Trophy, key: 'featureEarn' },
	{ icon: TrendingUp, key: 'featureClimb' }
] as const

type Props = { isAuthenticated: boolean }

export function HomeIntro({ isAuthenticated }: Props) {
	const t = useTranslations('Home')

	return (
		<div className="flex flex-col">
			<SectionTitle>
				<span className="text-2xl">{t.rich('welcome', { accent })}</span>
			</SectionTitle>

			<Card className="relative isolate">
				<CardGlow color="green" position="top" />

				<Link
					href="/rules"
					className="absolute inset-0 z-0"
					aria-label={t('viewRules')}
				/>

				<CardContent className="flex flex-col gap-4 pt-4">
					<div className="grid grid-cols-3 gap-2">
						{features.map(({ icon: Icon, key }) => (
							<div
								key={key}
								className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center"
							>
								<Icon className="size-5 text-green-400" />
								<span className="text-xs font-bold">{t(key)}</span>
							</div>
						))}
					</div>
				</CardContent>

				{!isAuthenticated && (
					<CardFooter>
						<Button
							asChild
							size="lg"
							className="relative z-10 w-full"
							variant="outline"
						>
							<a href="/auth/login">
								<LogIn className="mr-2 size-4" />
								{t('signInToPlay')}
							</a>
						</Button>
					</CardFooter>
				)}
			</Card>
		</div>
	)
}
