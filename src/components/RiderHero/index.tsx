import { Users } from 'lucide-react'

import type { getRiderStats } from '@/app/riders/[id]/data'
import { MedalCounts } from '@/components/MedalCounts'

type TRiderHero = {
	stats: Awaited<ReturnType<typeof getRiderStats>>
}

export function RiderHero({ stats }: TRiderHero) {
	const points = Number(stats?.points ?? 0)
	const timesPicked = Number(stats?.times_picked ?? 0)
	const medals = {
		gold: Number(stats?.gold ?? 0),
		silver: Number(stats?.silver ?? 0),
		bronze: Number(stats?.bronze ?? 0)
	}

	return (
		<div className="bg-card flex flex-wrap items-center gap-6 rounded-xl p-4">
			<div className="flex flex-col items-center">
				<span className="text-5xl leading-none font-black">{points}</span>
				<span className="text-muted-foreground text-xs font-black tracking-wide uppercase">
					Points
				</span>
			</div>

			<MedalCounts
				medal_1={medals.gold}
				medal_2={medals.silver}
				medal_3={medals.bronze}
				size="lg"
			/>

			{timesPicked > 0 && (
				<div className="ml-auto flex items-center gap-1.5">
					<span className="text-xl font-black">{timesPicked}</span>
					<Users size={25} className="text-brand-red" />
					<span className="text-muted-foreground text-xs tracking-wide uppercase">
						Times picked
					</span>
				</div>
			)}
		</div>
	)
}
