import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'

type Gp = {
	start_date: Date | string | null | undefined
	finished: boolean | null | undefined
}

export function filterGps<T extends Gp & { id: number }>(
	gps: T[],
	showAll: boolean,
	isPastYear: boolean,
	resultGpIds?: Set<number>
) {
	const allStages = gps.map((gp) => getMacroStage(gp.start_date, gp.finished))
	const latestFinishedIdx = allStages.lastIndexOf(EMacroStage.After)
	const showToggle = !isPastYear && latestFinishedIdx >= 1

	const indexed = gps.map((gp, i) => ({ gp, stage: allStages[i] }))
	let visible =
		showAll || isPastYear
			? indexed
			: indexed.filter(
					({ stage }, i) =>
						stage !== EMacroStage.After || i === latestFinishedIdx
				)

	if (resultGpIds) {
		visible = visible.filter(
			({ gp, stage }) => stage !== EMacroStage.After || resultGpIds.has(gp.id)
		)
	}

	const isUpNext = visible.findIndex(({ stage }) => stage === EMacroStage.Before)

	return { visible, showToggle, isUpNext }
}
