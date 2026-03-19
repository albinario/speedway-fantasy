import type { Metadata } from 'next'

import { getGp } from '@/app/gps/data'
import { GpCard } from '@/components/GpCard'
import { EMacroStage } from '@/enums'

import { metaData } from './constants'

export const metadata: Metadata = metaData

export default async function GpCardPage() {
	const gp = await getGp(41)

	if (!gp) return null

	return (
		<div className="grid grid-cols-[auto_1fr_1fr_1fr] items-center gap-4">
			{/* Header row */}
			<div className="text-2xl font-bold">GP Cards</div>
			<div className="text-center">Before</div>
			<div className="text-center">During</div>
			<div className="text-center">After</div>

			{/* Logged out row */}
			<div className="text-end">Logged out</div>
			<GpCard gp={gp} macroStage={EMacroStage.Before} />
			<GpCard gp={gp} macroStage={EMacroStage.During} />
			<GpCard gp={gp} macroStage={EMacroStage.After} />

			{/* Logged in row */}
			<div className="text-end">Logged in</div>
			<GpCard gp={gp} macroStage={EMacroStage.Before} isLoggedIn />
			<GpCard gp={gp} macroStage={EMacroStage.During} isLoggedIn />
			<GpCard gp={gp} macroStage={EMacroStage.After} isLoggedIn />
		</div>
	)
}
