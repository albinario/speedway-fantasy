import { AutoRefresh } from '@/components/AutoRefresh'
import { GpCard } from '@/components/GpCard'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMacroStage } from '@/lib/dates'

import {
	getGp,
	getGpRidersPreview,
	getGpRidersResults,
	getGpUsersResults,
	getGpUsersWithStandings
} from './data'
import { GpMissingStandingsCard } from './GpMissingStandingsCard'
import { GpUsersStandingsTable } from './GpUsersStandingsTable'
import { GpRidersPreviewTable, GpRidersResultsTable } from './RidersTables'
import { GpUsersResultsTable } from './UsersResultsTable'

type TGpPage = {
	params: Promise<{ id: string }>
}

export default async function GpPage({ params }: TGpPage) {
	const { id } = await params
	const gp = await getGp(Number(id))

	if (!gp) return null

	const macroStage = getMacroStage(gp.start_date, gp.finished)
	const isBefore = macroStage === EMacroStage.Before
	const viewer = await getViewer()
	const viewerId = viewer?.db?.id

	const year = new Date(gp.start_date).getFullYear()

	const [ridersResults, usersResults, usersWithStandings] = await Promise.all([
		macroStage !== EMacroStage.Before
			? getGpRidersResults(gp.id, viewerId)
			: Promise.resolve([]),
		macroStage !== EMacroStage.Before
			? getGpUsersResults(gp.id)
			: Promise.resolve([]),
		isBefore ? getGpUsersWithStandings(gp.id, year) : Promise.resolve([])
	])

	const ridersPreview =
		ridersResults.length <= 0
			? await getGpRidersPreview(gp.id, gp.wild_card_id, viewerId)
			: []

	return (
		<div className="columns-1 space-y-4 [&>*]:break-inside-avoid">
			{macroStage === EMacroStage.During && <AutoRefresh />}
			<GpCard gp={gp} macroStage={macroStage} />

			{isBefore ? (
				<GpUsersStandingsTable data={usersWithStandings} viewerId={viewerId} />
			) : usersResults.length > 0 ? (
				<GpUsersResultsTable
					data={usersResults}
					isBefore={isBefore}
					viewerId={viewerId}
				/>
			) : null}

			{ridersResults.length > 0 ? (
				<GpRidersResultsTable data={ridersResults} />
			) : ridersPreview.length > 0 ? (
				<GpRidersPreviewTable data={ridersPreview} isBefore={isBefore} />
			) : null}

			{viewer.isAdmin && (
				<GpMissingStandingsCard
					gpId={gp.id}
					year={new Date(gp.start_date).getFullYear()}
					round={gp.round}
				/>
			)}
		</div>
	)
}
