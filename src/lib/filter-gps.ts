import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'

type Gp = {
	start_date: Date | string | null | undefined
	finished: boolean | null | undefined
}

export function filterGps<T extends Gp>(
	gps: T[],
	showAll: boolean,
	isPastYear: boolean
) {
	const allStages = gps.map((gp) => getMacroStage(gp.start_date, gp.finished))
	const latestFinishedIdx = allStages.lastIndexOf(EMacroStage.After)
	const showToggle = !isPastYear && latestFinishedIdx >= 1

	const indexed = gps.map((gp, i) => ({ gp, stage: allStages[i] }))
	const visible =
		showAll || isPastYear
			? indexed
			: indexed.filter(
					({ stage }, i) =>
						stage !== EMacroStage.After || i === latestFinishedIdx
				)

	const isUpNext = visible.findIndex(
		({ stage }) => stage === EMacroStage.Before
	)

	return { visible, showToggle, isUpNext }
}
