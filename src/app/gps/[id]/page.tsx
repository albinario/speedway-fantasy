import { getGpRiders, getViewerPicks } from '@/components/GpCard/data'
import { GpHeader } from '@/components/GpHeader'
import { PicksCounter } from '@/components/PicksCounter'
import { WildCardInfoBox } from '@/components/WildCardInfoBox'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMacroStage } from '@/lib/dates'

import { After } from './After'
import { Before } from './Before'
import { getGp } from './data'
import { During } from './During'

type TGpPage = {
	params: Promise<{ id: string }>
}

export default async function GpPage({ params }: TGpPage) {
	const { id } = await params
	const gp = await getGp(Number(id))

	if (!gp) return null

	const macroStage = getMacroStage(gp.start_date, gp.finished)
	const viewer = await getViewer()
	const viewerId = viewer?.db?.id

	const [riders, existingPicks] = viewerId
		? await Promise.all([
				getGpRiders(gp.wild_card_id),
				getViewerPicks(gp.id, viewerId)
			])
		: [[], null]

	return (
		<div className="columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3 xl:columns-4 [&>*]:break-inside-avoid">
			<section
				aria-label={`${gp.city_name} Grand Prix`}
				className="relative overflow-hidden rounded-xl"
			>
				<GpHeader
					cityId={gp.city_id}
					cityName={gp.city_name}
					countryCode={gp.country_code}
					round={gp.round}
					startDate={gp.start_date}
					timeZone={gp.time_zone}
					macroStage={macroStage}
					showCountdown={macroStage === EMacroStage.Before}
				/>
			</section>

			{macroStage === EMacroStage.Before && (
				<Before
					gpId={gp.id}
					gpName={gp.city_name}
					gpRound={gp.round}
					viewerId={viewerId}
					riders={riders}
					existingPicks={existingPicks ?? null}
				/>
			)}

			{macroStage === EMacroStage.During && (
				<During heatsFinished={gp.heats_finished ?? 0} />
			)}

			{macroStage === EMacroStage.After && <After />}

			<PicksCounter gpId={gp.id} />

			{gp.wild_card_id && (
				<WildCardInfoBox
					countryCode={gp.wild_card_country_code}
					name={gp.wild_card_name}
					riderId={gp.wild_card_id}
				/>
			)}
		</div>
	)
}
