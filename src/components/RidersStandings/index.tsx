import { MedalIcon } from '@/components/MedalIcon'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { EMedal } from '@/enums'
import type { TParamValues } from '@/lib/params'

import { getRidersStandings } from './data'

type TRidersStandings = {
	activeYear: number | TParamValues
	limit?: number
	noData: string
}

export async function RidersStandings({
	activeYear,
	limit,
	noData
}: TRidersStandings) {
	const ridersStandings = await getRidersStandings(activeYear, limit)

	return ridersStandings?.length > 0 ? (
		<Table>
			<TableHeader>
				<TableRow className="bg-muted/50">
					<TableHead>Pos</TableHead>
					<TableHead>Name</TableHead>
					<TableHead className="text-center">Points</TableHead>

					<TableHead>
						<MedalIcon medal={EMedal.Gold} />
					</TableHead>

					<TableHead>
						<MedalIcon medal={EMedal.Silver} />
					</TableHead>

					<TableHead>
						<MedalIcon medal={EMedal.Bronze} />
					</TableHead>

					<TableHead className="text-right">Heats</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{ridersStandings.map((standing, index) => (
					<TableRow key={index}>
						<TableCell>{standing.name}</TableCell>

						<TableCell className="text-center">
							{standing.total_points}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	) : (
		<p>{noData}</p>
	)
}
