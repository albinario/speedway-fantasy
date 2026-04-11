import type { Metadata } from 'next'

import { getGp } from '@/app/gps/[id]/data'
import { GpCard } from '@/components/GpCard'
import { EMacroStage } from '@/enums'

import { metaData } from './constants'

export const metadata: Metadata = metaData

export default async function GpCardPage() {
	const gp = await getGp(52)

	if (!gp) return null

	return (
		<div className="grid grid-cols-[auto_1fr_1fr_1fr] items-center gap-4">
			{/* Header row */}
			<div className="text-2xl font-bold"></div>
			<div className="text-center">Before</div>
			<div className="text-center">During</div>
			<div className="text-center">After</div>

			{/* Logged out row */}
			<div className="text-end">Out</div>
			<GpCard gp={gp} macroStage={EMacroStage.Before} />
			<GpCard gp={gp} macroStage={EMacroStage.During} />
			<GpCard gp={gp} macroStage={EMacroStage.After} />

			{/* Logged in row */}
			<div className="text-end">In</div>
			<GpCard gp={gp} macroStage={EMacroStage.Before} viewerId={1} />
			<GpCard gp={gp} macroStage={EMacroStage.During} viewerId={1} />
			<GpCard gp={gp} macroStage={EMacroStage.After} viewerId={1} />
		</div>
	)
}
