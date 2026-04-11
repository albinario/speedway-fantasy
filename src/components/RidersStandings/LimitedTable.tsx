import type { getRidersStandings } from '@/app/riders/data'
import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { SectionTitle } from '@/components/SectionTitle'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMedalColorStr } from '@/lib/medals'

type TRow = Awaited<ReturnType<typeof getRidersStandings>>[number]

export function RidersLimitedTable({
	data,
	limit
}: {
	data: TRow[]
	limit?: number
}) {
	return (
		<div>
			<SectionTitle href="/riders">
				Top <span className="text-green-400">{limit}</span> riders
			</SectionTitle>

			<Card className="p-0">
				<Table>
					<TableBody>
						{data.map((row, i) => {
							const pos = i + 1
							const isMedal = pos <= 3
							return (
								<TableRow key={row.rider_id}>
									<TableCell className="pl-6">
										<span
											className={`inline-flex size-7 items-center justify-center rounded-md ${isMedal ? `${getMedalColorStr(pos, 'bg')} text-black` : 'bg-gray-800'}`}
										>
											{pos}
										</span>
									</TableCell>
									<TableCell className="px-0">
										<RiderImage className="size-10" riderId={row.rider_id} />
									</TableCell>
									<TableCell>
										{row.name && (
											<RiderName name={row.name} riderId={row.rider_id} />
										)}
										<div className="mt-1 flex w-fit items-center gap-1">
											<FlagNumber
												countryCode={row.country_code}
												number={row.number}
											/>
										</div>
									</TableCell>
									<TableCell className="text-center">
										<span
											className={`text-lg ${isMedal ? getMedalColorStr(pos, 'text') : ''}`}
										>
											{row.total_points}
										</span>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</Card>
		</div>
	)
}
