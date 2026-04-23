import { getNextGp } from '@/app/gps/data'
import { ActivityFeed } from '@/components/ActivityFeed'
import { GpCard } from '@/components/GpCard'
import { InfoBox } from '@/components/InfoBox'
import { SectionTitle } from '@/components/SectionHeader'
import { EMacroStage } from '@/enums'

export default async function ActivityFeedPage() {
	const latestGp = await getNextGp()

	return (
		<div className="columns-1 space-y-4 p-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
			<div>
				<SectionTitle href="/activity">Latest activity</SectionTitle>

				<InfoBox>
					<ActivityFeed limit={10} />
				</InfoBox>
			</div>

			{latestGp && <GpCard gp={latestGp} macroStage={EMacroStage.Before} />}
		</div>
	)
}
