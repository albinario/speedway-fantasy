import { getUsersProgress } from '@/components/PositionProgress/data'
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
	// Season trend only makes sense for full-season standings of a single year
	const showProgress = !limit && form === 'total' && typeof year === 'number'

	const [standings, viewer, progress] = await Promise.all([
		form === 'last2'
			? getUsersFormStandings(2, limit)
			: form === 'last4'
				? getUsersFormStandings(4, limit)
				: getUsersStandings(year, limit),
		getViewer(),
		showProgress ? getUsersProgress(year) : null
	])

	if (!standings.length) return null

	if (limit) {
		return <UsersLimitedTable data={standings} limit={limit} />
	}

	return (
		<UsersStandingsTable
			data={standings}
			viewerId={viewer?.db?.id}
			progress={progress && progress.rounds >= 2 ? progress : undefined}
		/>
	)
}
