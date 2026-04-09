import { ActivityFeed } from '@/components/ActivityFeed'
import { InfoBox } from '@/components/InfoBox'
import { InfoBoxTitle } from '@/components/InfoBox/Title'
import { getViewer } from '@/lib/auth/get-viewer'

export default async function Home() {
	const viewer = await getViewer()

	if (!viewer.isAdmin) return null

	return (
		<div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
			<InfoBox>
				<InfoBoxTitle>Latest activity</InfoBoxTitle>
				<ActivityFeed limit={10} />
			</InfoBox>
		</div>
	)
}
