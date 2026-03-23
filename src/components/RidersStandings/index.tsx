import { Flag } from '@/components/Flag'
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
}

export async function RidersStandings({ activeYear, limit }: TRidersStandings) {
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

					<TableHead className="text-center">Heats</TableHead>
					<TableHead className="text-center">GP's</TableHead>
					<TableHead className="text-right">Picked</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{ridersStandings.map((standing, index) => (
					<TableRow key={index}>
						<TableCell>{index + 1}</TableCell>
						<TableCell className="flex items-center gap-2">
							<Flag countryCode={standing.country_code} />
							{standing.name}
						</TableCell>
						<TableCell className="text-center">{standing.total_points}</TableCell>
						<TableCell className="text-center">{standing.medal_1}</TableCell>
						<TableCell className="text-center">{standing.medal_2}</TableCell>
						<TableCell className="text-center">{standing.medal_3}</TableCell>
						<TableCell className="text-center">{standing.heats}</TableCell>
						<TableCell className="text-center">{standing.gps}</TableCell>
						<TableCell className="text-right">{standing.times_picked}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	) : (
		<p>No riders standings found</p>
	)
}
