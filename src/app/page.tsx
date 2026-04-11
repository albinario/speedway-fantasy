import { getLatestGp, getNextGp } from '@/app/gps/data'
import { ActivityFeed } from '@/components/ActivityFeed'
import { GpCard } from '@/components/GpCard'
import { InfoBox } from '@/components/InfoBox'
import { RidersStandings } from '@/components/RidersStandings'
import { SectionTitle } from '@/components/SectionTitle'
import { UsersStandings } from '@/components/UsersStandings'
import { getViewer } from '@/lib/auth/get-viewer'
import { getYearValues } from '@/lib/year'

export default async function Home() {
	const yearValues = await getYearValues(Promise.resolve({}))
	const [viewer, upcomingGp, latestGp] = await Promise.all([
		getViewer(),
		getNextGp(),
		getLatestGp()
	])

	return (
		<div className="columns-1 gap-4 space-y-4 md:columns-2 xl:columns-3 [&>*]:break-inside-avoid">
			{latestGp && (
				<div>
					<SectionTitle>
						Latest <span className="text-green-400">GP</span>
					</SectionTitle>
					<GpCard gp={latestGp} linked viewerId={viewer?.db?.id} />
				</div>
			)}
			{upcomingGp && (
				<div>
					<SectionTitle>
						Upcoming <span className="text-green-400">GP</span>
					</SectionTitle>
					<GpCard gp={upcomingGp} linked viewerId={viewer?.db?.id} />
				</div>
			)}

			<UsersStandings year={2025} limit={5} />
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
