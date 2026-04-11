import { FlagNumber } from '@/components/FlagNumber'
import { InfoBox } from '@/components/InfoBox'
import { MedalIcon } from '@/components/MedalIcon'
import { UserName } from '@/components/UserName'
import { getMedalColor } from '@/lib/medals'
import { sortedPicks } from '@/lib/picks'

import { getViewerGpRow } from './data'

type TViewerResultRow = {
	gpId: number
	viewerId: number
}

export async function ViewerResultRow({ gpId, viewerId }: TViewerResultRow) {
	const row = await getViewerGpRow(gpId, viewerId)

	if (!row) return null

	const pos = row.pos ?? null
	const isMedal = pos != null && pos <= 3

	const picks = sortedPicks(row)

	const medals = [
		...(row.medal_1 ? Array<number>(row.medal_1).fill(1) : []),
		...(row.medal_2 ? Array<number>(row.medal_2).fill(2) : []),
		...(row.medal_3 ? Array<number>(row.medal_3).fill(3) : [])
	]

	return (
		<InfoBox className="flex items-center gap-3">
			<span
				className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-gray-800"
				style={
					isMedal && pos != null
						? { backgroundColor: getMedalColor(pos), color: 'black' }
						: undefined
				}
			>
				{pos ?? '—'}
			</span>

			<div className="min-w-0 flex-1">
				<UserName
					userId={row.user_id}
					firstName={row.first_name}
					lastName={row.last_name}
					stars={row.stars}
					isViewer
				/>
				<div className="mt-1 flex items-center gap-2">
					{picks.map((pick, i) => (
						<FlagNumber
							key={i}
							countryCode={pick.countryCode}
							number={pick.number}
						/>
					))}
				</div>
			</div>

			{medals.length > 0 && (
				<div className="flex gap-1">
					{medals.map((m, i) => (
						<MedalIcon key={i} type={m} />
					))}
				</div>
			)}

			<span className="text-lg">{row.points}</span>
		</InfoBox>
	)
}
