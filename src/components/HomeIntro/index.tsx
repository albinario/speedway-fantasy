import Link from 'next/link'

import { LogIn, Trophy, TrendingUp, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const features = [
	{ icon: Users, label: 'Pick 3 riders' },
	{ icon: Trophy, label: 'Earn points' },
	{ icon: TrendingUp, label: 'Climb standings' },
]

type Props = { isAuthenticated: boolean }

export function HomeIntro({ isAuthenticated }: Props) {
	return (
		<Card className="relative">
			<Link href="/rules" className="absolute inset-0 z-0" aria-label="View rules" />
			<CardContent className="flex flex-col gap-4 pt-4">
			<div className="grid grid-cols-3 gap-2">
					{features.map(({ icon: Icon, label }) => (
						<div
							key={label}
							className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center"
						>
							<Icon className="size-5 text-green-400" />
							<span className="text-xs font-bold">{label}</span>
						</div>
					))}
				</div>
			</CardContent>
			{!isAuthenticated && (
				<CardFooter>
					<Button asChild size="lg" className="relative z-10 w-full" variant="outline">
						<a href="/auth/login">
							<LogIn className="mr-2 size-4" />
							Sign in to play
						</a>
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}
