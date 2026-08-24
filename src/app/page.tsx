import { Suspense } from 'react'

import { getLatestGp, getNextGp } from '@/app/gps/data'
import { HallOfFameCard } from '@/app/hall-of-fame/Card'
import { getLatestHallOfFame } from '@/app/hall-of-fame/data'
import { ActivityFeed } from '@/components/ActivityFeed'
import { GpCard } from '@/components/GpCard'
import { RidersStandings } from '@/components/RidersStandings'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import { UsersStandings } from '@/components/UsersStandings'
import { getViewer } from '@/lib/auth/get-viewer'
import { getYearValues } from '@/lib/year'

function SectionFallback() {
	return <Card className="h-48 animate-pulse" />
}

function isToday(date: Date | string | null | undefined): boolean {
	if (!date) return false
	return new Date(date).toDateString() === new Date().toDateString()
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

	const latestGpIsToday = isToday(latestGp?.start_date)
	const nextGpIsToday = isToday(nextGp?.start_date)
	const todayGp = latestGpIsToday ? latestGp : nextGpIsToday ? nextGp : null

	return (
		<div className="columns-1 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:break-inside-avoid">
			{todayGp && (
				<div>
					<SectionTitle href={`/gps/${todayGp.id}`} linkLabel="View GP">
						Today&apos;s <span className="text-green-400">GP</span>
					</SectionTitle>
					<Suspense fallback={<SectionFallback />}>
						<GpCard gp={todayGp} isUpNext linked imageLoading="eager" />
					</Suspense>
				</div>
			)}

			{nextGp?.round === 1 && latestHofYear && (
				<div>
					<SectionTitle href="/hall-of-fame">{latestHofYear}</SectionTitle>
					<HallOfFameCard entries={latestHallOfFame} glow viewerId={viewerId} />
				</div>
			)}

			<Suspense fallback={<SectionFallback />}>
				<UsersStandings year={yearValues.activeYear} limit={3} />
			</Suspense>

			{latestGp && !latestGpIsToday && (
				<div>
					<SectionTitle href={`/gps/${latestGp.id}`} linkLabel="View GP">
						Latest <span className="text-green-400">GP</span>
					</SectionTitle>
					<Suspense fallback={<SectionFallback />}>
						<GpCard gp={latestGp} linked imageLoading="eager" />
					</Suspense>
				</div>
			)}

			{nextGp && !nextGpIsToday && (
				<div>
					<SectionTitle href={`/gps/${nextGp.id}`} linkLabel="View GP">
						Next <span className="text-green-400">GP</span>
					</SectionTitle>
					<Suspense fallback={<SectionFallback />}>
						<GpCard gp={nextGp} isUpNext linked imageLoading="eager" />
					</Suspense>
				</div>
			)}

			{/* <Suspense fallback={<SectionFallback />}>
				<RidersStandings year={yearValues.activeYear} limit={5} />
			</Suspense> */}

			<div>
				<SectionTitle href="/activity">Latest activity</SectionTitle>
				<Card className="px-4 py-1">
					<Suspense fallback={<SectionFallback />}>
						<ActivityFeed limit={10} />
					</Suspense>
				</Card>
			</div>

			{nextGp?.round !== 1 && latestHofYear && (
				<div>
					<SectionTitle href="/hall-of-fame">{latestHofYear}</SectionTitle>
					<HallOfFameCard entries={latestHallOfFame} viewerId={viewerId} />
				</div>
			)}
		</div>
	)
}
