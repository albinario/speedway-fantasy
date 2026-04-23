import { GpCard } from '@/components/GpCard'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMacroStage } from '@/lib/dates'

import {
	getGp,
	getGpRidersPreview,
	getGpRidersResults,
	getGpUsersResults
} from './data'
import {
	GpRidersPreviewTable,
	GpRidersResultsTable
} from './RidersResultsTable'
import { GpUsersResultsTable } from './UsersResultsTable'

type TGpPage = {
	params: Promise<{ id: string }>
}

export default async function GpPage({ params }: TGpPage) {
	const { id } = await params
	const gp = await getGp(Number(id))

	if (!gp) return null

	const macroStage = getMacroStage(gp.start_date, gp.finished)
	const viewer = await getViewer()
	const viewerId = viewer?.db?.id

	const [ridersResults, usersResults] = await Promise.all([
		macroStage !== EMacroStage.Before
			? getGpRidersResults(gp.id, viewerId)
			: Promise.resolve([]),
		macroStage !== EMacroStage.Before
			? getGpUsersResults(gp.id)
			: Promise.resolve([])
	])

	const ridersPreview =
		ridersResults.length === 0
			? await getGpRidersPreview(gp.id, gp.wild_card_id, viewerId)
			: []

	return (
		<div className="columns-1 space-y-4 sm:columns-2 xl:columns-3 [&>*]:break-inside-avoid">
			<GpCard gp={gp} macroStage={macroStage} />

			{usersResults.length > 0 && (
				<GpUsersResultsTable data={usersResults} viewerId={viewerId} />
			)}

			{ridersResults.length > 0 ? (
				<GpRidersResultsTable data={ridersResults} />
			) : ridersPreview.length > 0 ? (
				<GpRidersPreviewTable data={ridersPreview} />
			) : null}
		</div>
	)
}
