import type { Metadata } from 'next'

import { getGp } from '@/app/gps/[id]/data'
import { UserGpCard } from '@/components/GpCard'
import { EMacroStage } from '@/enums'

import { metaData } from './constants'

export const metadata: Metadata = metaData

export default async function GpCardPage() {
	const gp = await getGp(61)

	if (!gp) return null

	return (
		<div className="grid grid-cols-[auto_1fr_1fr_1fr] items-center gap-4">
			{/* Header row */}
			<div className="text-2xl font-bold"></div>
			<div className="text-center">Before</div>
			<div className="text-center">During</div>
			<div className="text-center">After</div>

			{/* Logged out row */}
			<div className="text-end">Me</div>
			<UserGpCard gp={gp} macroStage={EMacroStage.Before} userId={1} isUpNext />
			<UserGpCard gp={gp} macroStage={EMacroStage.During} userId={1} />
			<UserGpCard gp={gp} macroStage={EMacroStage.After} userId={1} />

			{/* Logged in row */}
			<div className="text-end">You</div>
			<UserGpCard
				gp={gp}
				macroStage={EMacroStage.Before}
				userId={158}
				isUpNext
			/>
			<UserGpCard gp={gp} macroStage={EMacroStage.During} userId={158} />
			<UserGpCard gp={gp} macroStage={EMacroStage.After} userId={158} />
		</div>
	)
}
