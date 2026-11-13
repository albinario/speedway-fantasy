import { VenueHistoryContent } from '@/app/gps/[id]/VenueHistory'
import type { getGps } from '@/app/gps/data'
import { ActivityFeed } from '@/components/ActivityFeed'
import { HeatsCounter } from '@/components/HeatsCounter'
import { WildCard } from '@/components/WildCard'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMacroStage } from '@/lib/dates'

import { GpCardBase } from './Base'
import { GpTopPlayers } from './TopPlayers'
import { GpTopRiders } from './TopRiders'
import { UserPicks } from './UserPicks'

type TGpCard = {
	gp: Awaited<ReturnType<typeof getGps>>[number]
	isUpNext?: boolean
	linked?: boolean
	macroStage?: EMacroStage
	showVenueHistory?: boolean
	viewerId?: number
	imageLoading?: 'eager' | 'lazy'
}

export async function GpCard({
	gp,
	isUpNext = false,
	linked = false,
	macroStage: macroStageProp,
	showVenueHistory = false,
	viewerId: viewerIdProp,
	imageLoading
}: TGpCard) {
	const macroStage = macroStageProp ?? getMacroStage(gp.start_date, gp.finished)
	const viewerId = viewerIdProp ?? (await getViewer())?.db?.id

	return (
		<GpCardBase
			gp={gp}
			isUpNext={isUpNext}
			linked={linked}
			macroStage={macroStage}
			imageLoading={imageLoading}
		>
			{macroStage === EMacroStage.During && (
				<HeatsCounter heatsFinished={gp.heats_finished ?? 0} />
			)}

			{linked && macroStage !== EMacroStage.Before && (
				<>
					<GpTopPlayers gpId={gp.id} />
					<GpTopRiders gpId={gp.id} viewerId={viewerId} />
				</>
			)}

			{macroStage === EMacroStage.Before && viewerId && (
				<UserPicks gpId={gp.id} gpStartDate={gp.start_date} userId={viewerId} />
			)}

			{macroStage === EMacroStage.Before && <ActivityFeed gpId={gp.id} />}

			{macroStage === EMacroStage.Before && gp.wild_card_id && (
				<WildCard
					countryCode={gp.wild_card_country_code}
					name={gp.wild_card_name}
					riderId={gp.wild_card_id}
				/>
			)}

			{showVenueHistory && macroStage === EMacroStage.Before && (
				<VenueHistoryContent
					gpId={gp.id}
					cityName={gp.city_name}
					viewerId={viewerId}
				/>
			)}
		</GpCardBase>
	)
}
