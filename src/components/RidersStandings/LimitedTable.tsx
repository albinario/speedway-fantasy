import type { getRidersStandings } from '@/app/riders/data'
import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'

import { PosBadge } from '../UsersStandings/PosBadge'

type TRow = Awaited<ReturnType<typeof getRidersStandings>>[number]

export function RidersLimitedTable({
	data,
	limit
}: {
	data: TRow[]
	limit: number
}) {
	return (
		<div>
			<SectionTitle href="/riders">
				Top <span className="text-green-400">{limit}</span> riders
			</SectionTitle>

			<Card className="divide-border divide-y overflow-hidden py-0">
				{data.map((row, i) => {
					const pos = i + 1

					return (
						<div
							key={row.rider_id}
							className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3"
						>
							<PosBadge pos={pos} size="lg" />

							<div className="flex min-w-0 items-center gap-2">
								<RiderImage
									className="size-10 shrink-0"
									name={row.name}
									riderId={row.rider_id}
								/>
								<div className="min-w-0">
									{row.name && (
										<RiderName name={row.name} riderId={row.rider_id} />
									)}
									<FlagNumber
										countryCode={row.country_code}
										number={row.number}
									/>
								</div>
							</div>

							<span className="text-lg">{row.total_points}</span>
						</div>
					)
				})}
			</Card>
		</div>
	)
}
