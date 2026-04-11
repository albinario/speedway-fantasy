import Link from 'next/link'

import { ChevronRight } from 'lucide-react'

import type { getRidersStandings } from '@/app/riders/data'
import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

type TRow = Awaited<ReturnType<typeof getRidersStandings>>[number]

export function RidersLimitedTable({ data }: { data: TRow[] }) {
	return (
		<Card className="bg-black p-0">
			<Table>
				<TableBody>
					{data.map((row, i) => (
						<TableRow key={row.rider_id}>
							<TableCell>
								<span className="inline-flex size-7 items-center justify-center rounded-md bg-gray-800">
									{i + 1}
								</span>
							</TableCell>
							<TableCell>
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
								<span className="text-lg">{row.total_points}</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="p-3 pt-0">
				<Button asChild variant="shale" className="w-full">
					<Link href="/riders">
						View all riders <ChevronRight />
					</Link>
				</Button>
			</div>
		</Card>
	)
}
