import { Suspense } from 'react'

import { getLatestGp, getNextGp } from '@/app/gps/data'
import { HallOfFameCard } from '@/app/hall-of-fame/Card'
import { getLatestHallOfFame } from '@/app/hall-of-fame/data'
import { GpCard } from '@/components/GpCard'
import { GpSeasonProgress } from '@/components/GpSeasonProgress'
import { HomeIntro } from '@/components/HomeIntro'
import { HomeLeaderPodium } from '@/components/HomeLeaderPodium'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import { getViewer } from '@/lib/auth/get-viewer'
import { cn } from '@/lib/utils'
import { getYearValues } from '@/lib/year'

function SectionFallback() {
	return <Card className="h-48 animate-pulse" />
}

function msFromNow(date: Date | string | null | undefined): number {
	if (!date) return Infinity
	return Math.abs(new Date(date).getTime() - Date.now())
}

export default async function Home() {
	const [yearValues, nextGp, latestGp, latestHallOfFame, viewer] =
		await Promise.all([
			getYearValues(Promise.resolve({})),
			getNextGp(),
			getLatestGp(),
			getLatestHallOfFame(),
			getViewer()
		])

	const viewerId = viewer?.db?.id
	const latestHofYear = latestHallOfFame?.[0]?.year

	const nextGpIsCloser =
		msFromNow(nextGp?.start_date) <= msFromNow(latestGp?.start_date)

	const upNextGp = nextGp
	const prevGp = latestGp

	return (
		<div className="flex flex-col gap-4">
			<HomeIntro isAuthenticated={viewer.isAuthenticated} />

			<Suspense fallback={<SectionFallback />}>
				<HomeLeaderPodium year={yearValues.activeYear} viewerId={viewerId} />
			</Suspense>

			<Suspense fallback={<Card className="h-14 animate-pulse" />}>
				<GpSeasonProgress year={yearValues.activeYear} />
			</Suspense>

			<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
				{upNextGp && (
					<div className={cn(nextGpIsCloser ? 'order-1' : 'order-2')}>
						<SectionTitle href={`/gps/${upNextGp.id}`} linkLabel="View GP">
							Next <span className="text-green-400">GP</span>
						</SectionTitle>
						<Suspense fallback={<SectionFallback />}>
							<GpCard gp={upNextGp} isUpNext linked imageLoading="eager" />
						</Suspense>
					</div>
				)}

				{prevGp && (
					<div className={cn(nextGpIsCloser ? 'order-2' : 'order-1')}>
						<SectionTitle href={`/gps/${prevGp.id}`} linkLabel="View GP">
							Previous <span className="text-green-400">GP</span>
						</SectionTitle>
						<Suspense fallback={<SectionFallback />}>
							<GpCard gp={prevGp} linked imageLoading="eager" />
						</Suspense>
					</div>
				)}
			</div>

			{nextGp?.round !== 1 && latestHofYear && (
				<div>
					<SectionTitle href="/hall-of-fame" linkLabel="Hall of fame">
						Previous <span className="text-green-400">season</span>
					</SectionTitle>

					<HallOfFameCard entries={latestHallOfFame} glow viewerId={viewerId} />
				</div>
			)}
		</div>
	)
}
