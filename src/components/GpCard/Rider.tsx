import type { getRiderGps } from '@/app/riders/[id]/data'
import { MedalIcon } from '@/components/MedalIcon'
import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'

import { GpCardBase } from './Base'

type TRiderGpCard = {
	gp: Awaited<ReturnType<typeof getRiderGps>>[number]
	macroStage?: EMacroStage
}

export async function RiderGpCard({
	gp,
	macroStage: macroStageProp
}: TRiderGpCard) {
	const macroStage = macroStageProp ?? getMacroStage(gp.start_date, gp.finished)

	return (
		<GpCardBase gp={gp} linked macroStage={macroStage}>
			<div className="flex items-center">
				{gp.medal != null && <MedalIcon type={gp.medal} />}

				<span className="text-lg font-black">
					{gp.points} <span className="text-muted-foreground text-sm">pts</span>
				</span>

				<span className="text-muted-foreground ml-auto text-sm">
					Picked by {gp.times_picked}/{gp.total_pickers}
				</span>
			</div>
		</GpCardBase>
	)
}
