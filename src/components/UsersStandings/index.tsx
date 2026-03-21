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

import { getUsersStandings } from './data'

type TUsersStandings = {
	activeYear: number | TParamValues
	limit?: number
	noData: string
}

export async function UsersStandings({
	activeYear,
	limit,
	noData
}: TUsersStandings) {
	const usersStandings = await getUsersStandings(activeYear, limit)

	return usersStandings?.length > 0 ? (
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
				{usersStandings.map((standing, index) => (
					<TableRow key={index}>
						<TableCell>
							{standing.pos
								? `${standing.pos}/${standing.prev_pos}`
								: index + 1}
						</TableCell>

						<TableCell>
							{standing.first_name} {standing.last_name}
						</TableCell>

						<TableCell className="text-center">{standing.points}</TableCell>
						<TableCell className="text-center">{standing.medal_1}</TableCell>
						<TableCell className="text-center">{standing.medal_2}</TableCell>
						<TableCell className="text-center">{standing.medal_3}</TableCell>
						<TableCell className="text-right">{standing.heats}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	) : (
		<p>{noData}</p>
	)
}
