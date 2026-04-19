import { getGpTopRiders, getGpViewerPickedRiders } from '@/app/gps/[id]/data'
import { RidersResultRow } from '@/components/RidersResultRow'

type TTopRiders = {
	gpId: number
	limit?: number
	viewerId?: number
}

export async function GpTopRiders({ gpId, limit = 3, viewerId }: TTopRiders) {
	const [rows, viewerPicks] = await Promise.all([
		getGpTopRiders(gpId, limit),
		viewerId != null
			? getGpViewerPickedRiders(gpId, viewerId)
			: Promise.resolve([])
	])

	const validRows = rows.filter(
		(r): r is typeof r & { id: number } => r.id != null
	)
	if (!validRows.length || validRows[0].points === 0) return null

	const topIds = new Set(validRows.map((r) => r.id))
	const pickedIds = new Set(viewerPicks.map((r) => r.id))
	const extraRows = viewerPicks.filter(
		(r): r is typeof r & { id: number } => r.id != null && !topIds.has(r.id)
	)
	const displayRows = [...validRows, ...extraRows]

	return (
		<div className="flex flex-col gap-2">
			<div className="font-black uppercase">
				Top <span className="text-green-400">{limit}</span> riders
			</div>

			<div className="divide-border -mx-3 divide-y">
				{displayRows.map((row, i) => (
					<RidersResultRow
						key={row.id}
						riderId={row.id!}
						name={row.name}
						countryCode={row.country_code}
						number={row.number}
						medal={row.medal}
						points={row.points}
						pos={row.pos ?? null}
						isPicked={pickedIds.has(row.id!)}
					/>
				))}
			</div>
		</div>
	)
}
