import { getGpTopRiders } from '@/app/gps/data'
import { FlagNumber } from '@/components/FlagNumber'
import { InfoBox } from '@/components/InfoBox'
import { MedalIcon } from '@/components/MedalIcon'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { getMedalColorStr } from '@/lib/medals'

type TTopRiders = {
	gpId: number
	userId?: number
}

export async function TopRiders({ gpId, userId }: TTopRiders) {
	const rows = await getGpTopRiders(gpId, 3, userId)

	const validRows = rows.filter(
		(r): r is typeof r & { id: number } => r.id != null
	)
	if (!validRows.length || validRows[0].points === 0) return null

	return (
		<InfoBox className="flex flex-col gap-3">
			<div className="font-black uppercase">
				Top <span className="text-green-400">3</span> riders
			</div>

			<div className="divide-border -mx-2 divide-y">
				{validRows.map((row, i) => {
					const pos = i + 1

					return (
						<div key={row.id} className="flex items-center gap-3 p-1">
							<span className="inline-flex size-5 shrink-0 items-center justify-center rounded bg-white/10 text-xs">
								{pos}
							</span>

							<RiderImage
								className="size-8 shrink-0"
								riderId={row.id}
								name={row.name}
							/>

							<div className="min-w-0 flex-1">
								<RiderName
									className={
										(row.viewer_picked ?? 0) > 0 ? 'text-orange-400' : undefined
									}
									name={row.name}
									riderId={row.id}
								/>

								<FlagNumber
									countryCode={row.country_code}
									number={row.number}
									flagClassName="h-auto w-4"
								/>
							</div>

							{row.medal != null && <MedalIcon type={row.medal} />}

							<span
								className={`text-lg ${row.medal != null ? (getMedalColorStr(pos, 'text') ?? '') : ''}`}
							>
								{row.points}
							</span>
						</div>
					)
				})}
			</div>
		</InfoBox>
	)
}
