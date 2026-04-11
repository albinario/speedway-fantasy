import { getViewer } from '@/lib/auth/get-viewer'
import type { TParamValues } from '@/lib/params'

import { getUsersStandings } from './data'
import { UsersLimitedTable } from './LimitedTable'
import { UsersStandingsTable } from './Table'

type TUsersStandings = {
	year: number | TParamValues
	limit?: number
}

export async function UsersStandings({ year, limit }: TUsersStandings) {
	const [standings, viewer] = await Promise.all([
		getUsersStandings(year, limit),
		getViewer()
	])

	if (!standings.length) return null

	return limit ? (
		<UsersLimitedTable data={standings} viewerId={viewer?.db?.id} />
	) : (
		<UsersStandingsTable data={standings} viewerId={viewer?.db?.id} />
	)
}
