import { getGpViewerPickedRiders } from '@/app/gps/[id]/data'
import { RidersResultRow } from '@/components/RidersResultRow'

type TUserPicksResults = {
	gpId: number
	userId: number
}

export async function UserPicksResults({ gpId, userId }: TUserPicksResults) {
	const rows = await getGpViewerPickedRiders(gpId, userId)

	const validRows = rows.filter(
		(r): r is typeof r & { id: number } => r.id != null
	)
	if (!validRows.length) return null

	return (
		<div className="divide-border -mx-3 divide-y">
			{validRows.map((row, i) => (
				<RidersResultRow
					key={row.id}
					riderId={row.id}
					name={row.name}
					countryCode={row.country_code}
					number={row.number}
					medal={row.medal}
					points={row.points}
					pos={i + 1}
				/>
			))}
		</div>
	)
}
