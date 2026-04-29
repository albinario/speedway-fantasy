import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
	getUsersInStandingsWithoutGpResult,
	getUsersNotInStandings
} from './data'

type Props = {
	gpId: number
	year: number
	round: number
}

export async function GpMissingStandingsCard({ gpId, year, round }: Props) {
	const users =
		round === 1
			? await getUsersNotInStandings(year)
			: await getUsersInStandingsWithoutGpResult(gpId, year)

	if (!users.length) return null

	const title = round === 1 ? 'Missing all' : 'Missing'

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-1">
				{users.map((user) => (
					<span key={user.id} className="text-sm">
						{user.first_name} {user.last_name}
					</span>
				))}
			</CardContent>
		</Card>
	)
}
