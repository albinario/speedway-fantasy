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

import { UsersName } from '../UserName'
import { getUsersStandings } from './data'

type TUsersStandings = {
	activeYear: number | TParamValues
	limit?: number
}

export async function UsersStandings({ activeYear, limit }: TUsersStandings) {
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
							<UsersName
								firstName={standing.first_name}
								lastName={standing.last_name}
								stars={standing.stars}
							/>
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
		<p>No users standings found</p>
	)
}
