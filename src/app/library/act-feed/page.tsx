import { ActivityFeed } from '@/components/ActivityFeed'
import { InfoBox } from '@/components/InfoBox'
import { InfoBoxTitle } from '@/components/InfoBox/Title'
import { RegisteredPicks } from '@/components/RegisteredPicks'

export default async function ActivityFeedPage() {
	return (
		<div className="columns-1 gap-4 p-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
			<InfoBox>
				<InfoBoxTitle>Latest activity</InfoBoxTitle>
				<ActivityFeed limit={10} />
			</InfoBox>

			<RegisteredPicks gpId={60} />
		</div>
	)
}
