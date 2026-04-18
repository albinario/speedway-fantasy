import { InfoBox } from '@/components/InfoBox'
import { MedalIcon } from '@/components/MedalIcon'
import { UserName } from '@/components/UserName'
import { buildMedals, getMedalColorStr } from '@/lib/medals'

import { getUserGpRow } from './data'

type TUserResultRow = {
	gpId: number
	userId: number
}

export async function UserResultRow({ gpId, userId }: TUserResultRow) {
	const row = await getUserGpRow(gpId, userId)

	if (!row) return null

	const { pos } = row
	const isMedal = pos != null && pos <= 3

	const medals = buildMedals(row)

	return (
		<InfoBox className="flex items-center gap-2">
			{pos && (
				<span
					className={`shrink-0 text-xl font-black tabular-nums ${isMedal && pos != null ? getMedalColorStr(pos, 'text') : 'text-muted-foreground'}`}
				>
					<span className="text-lg">#</span>
					{pos}
				</span>
			)}

			<div className="min-w-0 flex-1">
				<UserName
					className="text-lg"
					firstName={row.first_name}
					lastName={row.last_name}
					stars={row.stars}
					userId={row.user_id}
				/>
			</div>

			{medals.length > 0 && (
				<div className="flex gap-1">
					{medals.map((m, i) => (
						<MedalIcon key={i} type={m} />
					))}
				</div>
			)}

			<span className="text-lg">
				{row.points} <span className="text-muted-foreground text-sm">pts</span>
			</span>
		</InfoBox>
	)
}
