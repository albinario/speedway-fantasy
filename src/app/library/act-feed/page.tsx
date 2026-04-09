import { ActivityFeed } from '@/components/ActivityFeed'
import { InfoBox } from '@/components/InfoBox'
import { InfoBoxTitle } from '@/components/InfoBox/Title'
import { PicksCounter } from '@/components/PicksCounter'
import { EMacroStage } from '@/enums'

export default async function ActivityFeedPage() {
	return (
		<div className="columns-1 gap-4 p-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
			<InfoBox>
				<InfoBoxTitle>Latest activity</InfoBoxTitle>
				<ActivityFeed limit={10} />
			</InfoBox>

			<PicksCounter gpId={60} macroStage={EMacroStage.Before} />
		</div>
	)
}
