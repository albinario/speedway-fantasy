import { MedalIcon } from '@/components/MedalIcon'
import { UserName } from '@/components/UserName'
import { PosBadge } from '@/components/PosBadge'
import { buildMedals } from '@/lib/medals'

import { getUserGpRow } from './data'

type TUserResultRow = {
	gpId: number
	isViewer?: boolean
	userId: number
}

export async function UserResultRow({
	gpId,
	isViewer = false,
	userId
}: TUserResultRow) {
	const row = await getUserGpRow(gpId, userId)

	if (!row) return null

	const { pos } = row

	const medals = buildMedals(row)

	return (
		<div className="flex items-center gap-2">
			<PosBadge pos={pos} size="lg" />

			<div className="min-w-0 flex-1">
				<UserName
					className="text-lg"
					firstName={row.first_name}
					lastName={row.last_name}
					isViewer={isViewer}
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

			<span className="text-lg">{row.points}</span>
		</div>
	)
}
