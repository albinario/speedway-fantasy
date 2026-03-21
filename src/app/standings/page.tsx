import type { Metadata } from 'next'

import { Fragment } from 'react/jsx-runtime'

import { MedalIcon } from '@/components/MedalIcon'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { YearSelector } from '@/components/YearSelector'
import { EMedal } from '@/enums'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { metaData, noData } from './constants'
import { getUsersStandings } from './data'

type TStandingsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
	}>
}

export const metadata: Metadata = metaData

export default async function StandingsPage({ searchParams }: TStandingsPage) {
	const yearValues = await getYearValues(searchParams)

	const usersStandings = await getUsersStandings(yearValues.activeYear, 10)

	return (
		<Fragment>
			<div className="flex items-center justify-between py-4">
				<h1 className="font-black uppercase">{metaData.title}</h1>
				<YearSelector yearValues={yearValues} />
			</div>

			{usersStandings?.length > 0 ? (
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

								<TableCell className="text-center">
									{standing.medal_1}
								</TableCell>

								<TableCell className="text-center">
									{standing.medal_2}
								</TableCell>

								<TableCell className="text-center">
									{standing.medal_3}
								</TableCell>
								<TableCell className="text-right">{standing.heats}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<p>{noData}</p>
			)}
		</Fragment>
	)
}
