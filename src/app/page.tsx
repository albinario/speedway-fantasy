import { ActivityFeed } from '@/components/ActivityFeed'
import { InfoBox } from '@/components/InfoBox'
import { InfoBoxTitle } from '@/components/InfoBox/Title'
import { RidersStandings } from '@/components/RidersStandings'
import { UsersStandings } from '@/components/UsersStandings'
import { getViewer } from '@/lib/auth/get-viewer'
import { getYearValues } from '@/lib/year'

export default async function Home() {
	const viewer = await getViewer()

	if (!viewer.isAdmin) return null

	const yearValues = await getYearValues(Promise.resolve({}))

	return (
		<div className="columns-1 gap-4 space-y-4 md:columns-2 xl:columns-3 [&>*]:break-inside-avoid">
			<UsersStandings year={2025} limit={10} />
			<RidersStandings year={2025} limit={10} />

			<InfoBox>
				<InfoBoxTitle>Latest activity</InfoBoxTitle>
				<ActivityFeed limit={10} />
			</InfoBox>
		</div>
	)
}
