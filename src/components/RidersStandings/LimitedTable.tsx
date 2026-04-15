import type { getRidersStandings } from '@/app/riders/data'
import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

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

			<Card className="bg-surface">
				<Table>
					<TableBody>
						{data.map((row, i) => {
							const pos = i + 1

							return (
								<TableRow key={row.rider_id}>
									<TableCell className="pr-0">
										<span className="inline-flex size-7 items-center justify-center rounded-md bg-white/10">
											{pos}
										</span>
									</TableCell>

									<TableCell className="px-0">
										<RiderImage
											className="size-10"
											name={row.name}
											riderId={row.rider_id}
										/>
									</TableCell>

									<TableCell>
										{row.name && (
											<RiderName name={row.name} riderId={row.rider_id} />
										)}

										<FlagNumber
											countryCode={row.country_code}
											number={row.number}
										/>
									</TableCell>

									<TableCell className="text-end">
										<span className="text-lg">{row.total_points}</span>
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
