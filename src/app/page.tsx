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
	const currentYear = new Date().getFullYear()
	const latestGpYear = latestGp
		? new Date(latestGp.start_date).getFullYear()
		: null
	const showHallOfFame = latestHofYear && latestGpYear !== currentYear

	return (
		<div className="columns-1 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:break-inside-avoid">
			{showHallOfFame && (
				<div>
					<SectionTitle href="/hall-of-fame">Hall of Fame</SectionTitle>
					<HallOfFameCard
						entries={latestHallOfFame}
						viewerId={viewerId}
						year={latestHofYear}
					/>
				</div>
			)}

			<Suspense fallback={<SectionFallback />}>
				<UsersStandings year={yearValues.activeYear} limit={5} />
			</Suspense>

			{nextGp && (
				<div>
					<SectionTitle href={`/gps/${nextGp.id}`} linkLabel="View GP">
						Next <span className="text-green-400">GP</span>
					</SectionTitle>
					<Suspense fallback={<SectionFallback />}>
						<GpCard gp={nextGp} isUpNext linked />
					</Suspense>
				</div>
			)}

			{latestGp && (
				<div>
					<SectionTitle href={`/gps/${latestGp.id}`} linkLabel="View GP">
						Latest <span className="text-green-400">GP</span>
					</SectionTitle>
					<Suspense fallback={<SectionFallback />}>
						<GpCard gp={latestGp} linked />
					</Suspense>
				</div>
			)}

			<Suspense fallback={<SectionFallback />}>
				<RidersStandings year={yearValues.activeYear} limit={5} />
			</Suspense>

			<div>
				<SectionTitle href="/activity">Latest activity</SectionTitle>
				<Card className="px-4 py-1">
					<Suspense fallback={<SectionFallback />}>
						<ActivityFeed limit={10} />
					</Suspense>
				</Card>
			</div>
		</div>
	)
}
