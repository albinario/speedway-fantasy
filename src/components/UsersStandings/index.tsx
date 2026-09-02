import { getViewer } from '@/lib/auth/get-viewer'
import type { TParamValues } from '@/lib/params'

import { getUsersFormStandings, getUsersStandings } from './data'
import { UsersLimitedTable } from './LimitedTable'
import { UsersStandingsTable } from './Table'

export type TUsersForm = 'total' | 'last2' | 'last4'

type TUsersStandings = {
	year: number | TParamValues
	limit?: number
	form?: TUsersForm
}

export async function UsersStandings({
	year,
	limit,
	form = 'total'
}: TUsersStandings) {
	const [standings, viewer] = await Promise.all([
		form === 'last2'
			? getUsersFormStandings(2, limit)
			: form === 'last4'
				? getUsersFormStandings(4, limit)
				: getUsersStandings(year, limit),
		getViewer()
	])

	if (!standings.length) return null

	if (limit) {
		return <UsersLimitedTable data={standings} limit={limit} />
	}

	return <UsersStandingsTable data={standings} viewerId={viewer?.db?.id} />
}
