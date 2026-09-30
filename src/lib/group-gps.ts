import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'

type Gp = {
	id: number
	start_date: Date | string | null | undefined
	finished: boolean | null | undefined
}

/**
 * Splits GPs (sorted by start date, ascending) into live/upcoming in round
 * order and finished newest first. Pass `resultGpIds` to only keep finished
 * GPs that have results for them.
 */
export function groupGps<T extends Gp>(gps: T[], resultGpIds?: Set<number>) {
	const indexed = gps.map((gp) => ({
		gp,
		stage: getMacroStage(gp.start_date, gp.finished)
	}))

	const upcoming = indexed.filter(({ stage }) => stage !== EMacroStage.After)
	const finished = indexed
		.filter(
			({ gp, stage }) =>
				stage === EMacroStage.After && (!resultGpIds || resultGpIds.has(gp.id))
		)
		.reverse()

	const upNextId = upcoming.find(({ stage }) => stage === EMacroStage.Before)
		?.gp.id

	return { upcoming, finished, upNextId }
}
