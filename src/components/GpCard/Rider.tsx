import type { getRiderGps } from '@/app/riders/[id]/data'
import { MedalIcon } from '@/components/MedalIcon'
import { EMacroStage } from '@/enums'

import { GpCardBase } from './Base'

type TRiderGpCard = {
	gp: Awaited<ReturnType<typeof getRiderGps>>[number]
}

export async function RiderGpCard({ gp }: TRiderGpCard) {
	return (
		<GpCardBase gp={gp} linked macroStage={EMacroStage.After}>
			<div className="flex items-center gap-4">
				{gp.pos != null && (
					<span className="text-xl font-black opacity-70">
						#<span className="text-2xl">{gp.pos}</span>
					</span>
				)}

				{gp.medal != null && <MedalIcon type={gp.medal} />}

				<span className="text-2xl font-black">
					{gp.points} <span className="text-muted-foreground text-sm">pts</span>
				</span>

				<span className="text-muted-foreground ml-auto text-sm">
					Picked by {gp.times_picked}/{gp.total_pickers}
				</span>
			</div>
		</GpCardBase>
	)
}
