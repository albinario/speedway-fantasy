import { PropsWithChildren } from 'react'

import { Users } from 'lucide-react'

import type { getRiderGps } from '@/app/riders/[id]/data'
import { MedalIcon } from '@/components/MedalIcon'
import { EMacroStage } from '@/enums'

import { GpCardBase } from './Base'

type TRiderGpCard = {
	gp: Awaited<ReturnType<typeof getRiderGps>>[number]
}

type TStat = {
	label: string
} & PropsWithChildren

function Stat({ label, children }: TStat) {
	return (
		<div className="flex flex-col items-center gap-1">
			<div className="flex items-center gap-1.5 text-3xl leading-none font-black">
				{children}
			</div>
			<span className="text-muted-foreground text-xs font-black tracking-wide uppercase">
				{label}
			</span>
		</div>
	)
}

export async function RiderGpCard({ gp }: TRiderGpCard) {
	if (new Date(gp.start_date) > new Date()) return null

	return (
		<GpCardBase gp={gp} linked macroStage={EMacroStage.After}>
			<div className="divide-foreground/10 grid grid-cols-3 items-end divide-x">
				<Stat label="Position">
					{gp.medal != null && <MedalIcon type={gp.medal} size="lg" />}
					{gp.pos != null ? (
						<span>{gp.pos}</span>
					) : (
						<span className="text-muted-foreground">–</span>
					)}
				</Stat>

				<Stat label="Points">
					<span className="text-4xl">{gp.points}</span>
				</Stat>

				<Stat label="Picked by">
					<Users className="size-6 text-green-400" />
					{gp.times_picked}
				</Stat>
			</div>
		</GpCardBase>
	)
}
