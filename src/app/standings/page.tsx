import type { Metadata } from 'next'

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
import { getYears } from '@/components/YearSelector/data'
import { EMedal } from '@/enums'
import { getParamValue, paramKeys } from '@/lib/params'

import { metaData, noData } from './constants'
import { getStandings } from './data'

type TStandingsPage = {
	searchParams: Promise<{
		year?: string
	}>
}

export const metadata: Metadata = metaData

export default async function StandingsPage({ searchParams }: TStandingsPage) {
	const years = await getYears()
	const latestYear = years?.[0]?.value
	const yearParam = await getParamValue(searchParams, paramKeys.year)
	const year = Number(yearParam) || latestYear || new Date().getFullYear()

	const standings = await getStandings(year)

	return (
		<>
			<h1>
				{metaData.title} <YearSelector years={years} selectedYear={year} />
			</h1>

			{standings?.length > 0 ? (
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
						{standings.map((standing) => (
							<TableRow key={standing.user_id}>
								<TableCell>
									{standing.pos}/{standing.prev_pos}
								</TableCell>

								<TableCell className="font-medium">
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

					{/* <TableFooter>
						<TableRow>
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">$2,500.00</TableCell>
						</TableRow>
					</TableFooter> */}
				</Table>
			) : (
				<p>{noData}</p>
			)}
		</>
	)
}
