import { getLatestGp, getNextGp } from '@/app/gps/data'
import { ActivityFeed } from '@/components/ActivityFeed'
import { GpCard } from '@/components/GpCard'
import { InfoBox } from '@/components/InfoBox'
import { RidersStandings } from '@/components/RidersStandings'
import { SectionTitle } from '@/components/SectionHeader'
import { UsersStandings } from '@/components/UsersStandings'
import { getYearValues } from '@/lib/year'

export default async function Home() {
	const yearValues = await getYearValues(Promise.resolve({}))
	const [nextGp, latestGp] = await Promise.all([getNextGp(), getLatestGp()])

	return (
		<div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:break-inside-avoid">
			<UsersStandings year={2025} limit={5} />

			{latestGp && (
				<div>
					<SectionTitle href={`/gps/${latestGp.id}`} linkLabel="View GP">
						Latest <span className="text-green-400">GP</span>
					</SectionTitle>
					<GpCard gp={latestGp} linked />
				</div>
			)}

			{nextGp && (
				<div>
					<SectionTitle href={`/gps/${nextGp.id}`} linkLabel="View GP">
						Next <span className="text-green-400">GP</span>
					</SectionTitle>
					<GpCard gp={nextGp} isUpNext linked />
				</div>
			)}

			<RidersStandings year={2025} limit={5} />

			<div>
				<SectionTitle href="/activity">Latest activity</SectionTitle>

				<InfoBox>
					<ActivityFeed limit={10} />
				</InfoBox>
			</div>
		</div>
	)
}
