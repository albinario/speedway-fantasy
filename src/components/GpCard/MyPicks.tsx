import { FlagNumber } from '@/components/FlagNumber'
import { InfoBox } from '@/components/InfoBox'
import { MedalIcon } from '@/components/MedalIcon'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { getMedalColorStr } from '@/lib/medals'

import { getViewerPicksWithRiders } from './data'

type TMyPicks = {
	gpId: number
	viewerId: number
}

export async function MyPicks({ gpId, viewerId }: TMyPicks) {
	const picks = await getViewerPicksWithRiders(gpId, viewerId)

	if (!picks) return null

	const riders = [
		{ id: picks.pick_1_id, name: picks.pick_1_name, number: picks.pick_1_number, countryCode: picks.pick_1_country, points: picks.pick_1_points, medal: picks.pick_1_medal },
		{ id: picks.pick_2_id, name: picks.pick_2_name, number: picks.pick_2_number, countryCode: picks.pick_2_country, points: picks.pick_2_points, medal: picks.pick_2_medal },
		{ id: picks.pick_3_id, name: picks.pick_3_name, number: picks.pick_3_number, countryCode: picks.pick_3_country, points: picks.pick_3_points, medal: picks.pick_3_medal },
	].filter((r): r is typeof r & { id: number; name: string } => r.id != null && r.name != null)

	if (!riders.length) return null

	return (
		<InfoBox className="flex flex-col gap-3">
			<div className="font-black uppercase">My picks</div>

			<div className="divide-border -mx-3 divide-y">
				{riders.map((rider) => {
					const medal = rider.medal
					return (
						<div key={rider.id} className="flex items-center gap-3 px-3 py-2">
							<RiderImage className="size-8 shrink-0" riderId={rider.id} />
							<div className="min-w-0 flex-1">
								<RiderName name={rider.name} riderId={rider.id} />
								<FlagNumber countryCode={rider.countryCode} number={rider.number} flagClassName="h-auto w-4" />
							</div>
							{medal != null && <MedalIcon type={medal} />}
							{rider.points != null && (
								<span className={`text-lg ${medal != null ? (getMedalColorStr(medal, 'text') ?? '') : ''}`}>
									{rider.points}
								</span>
							)}
						</div>
					)
				})}
			</div>
		</InfoBox>
	)
}
