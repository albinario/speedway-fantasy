import type { Metadata } from 'next'

import { getGp } from '@/app/gps/data'
import { EStage, GpCard } from '@/components/GpCard'

import { metaData } from './constants'

export const metadata: Metadata = metaData

export default async function GpCardPage() {
	const gp = await getGp(61)

	if (!gp) return null

	return (
		<div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4 items-center">
			{/* Header row */}
			<div className="text-2xl font-bold">GP Cards</div>
			<div className="text-center">Before</div>
			<div className="text-center">During</div>
			<div className="text-center">After</div>

			{/* Logged out row */}
			<div className="text-end">Logged out</div>
			<GpCard gp={gp} stage={EStage.BEFORE} showCountdown />
			<GpCard gp={gp} stage={EStage.DURING} />
			<GpCard gp={gp} stage={EStage.AFTER} />

			{/* Logged in row */}
			<div className="text-end">Logged in</div>
			<GpCard gp={gp} stage={EStage.BEFORE} isLoggedIn showCountdown />
			<GpCard gp={gp} stage={EStage.DURING} isLoggedIn />
			<GpCard gp={gp} stage={EStage.AFTER} isLoggedIn />
		</div>
	)
}
