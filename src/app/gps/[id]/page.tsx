import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { AutoRefresh } from '@/components/AutoRefresh'
import { GpCard } from '@/components/GpCard'
import { GpSeasonProgress } from '@/components/GpSeasonProgress'
import { PlayersRidersToggle } from '@/components/PlayersRidersToggle'
import { SectionTitle } from '@/components/SectionHeader'
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
import { VenueHistory } from './VenueHistory'

type TGpPage = {
	params: Promise<{ id: string }>
	searchParams?: Promise<{ view?: string }>
}

export async function generateMetadata({ params }: TGpPage): Promise<Metadata> {
	const { id } = await params
	const [gp, t] = await Promise.all([
		getGp(Number(id)),
		getTranslations('DetailPages')
	])
	if (!gp) return {}

	const values = {
		city: gp.city_name,
		round: gp.round,
		year: new Date(gp.start_date).getFullYear()
	}
	return {
		title: t('gp.title', values),
		description: t('gp.description', values)
	}
}

export default async function GpPage({ params, searchParams }: TGpPage) {
	const { id } = await params
	const view = (await searchParams)?.view === 'riders' ? 'riders' : 'players'
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
			? await getGpRidersPreview(gp.id, year, gp.wild_card_id, viewerId)
			: []

	const tCommon = await getTranslations('Common')

	const playersTable = isBefore ? (
		usersWithStandings.length > 0 ? (
			<GpUsersStandingsTable data={usersWithStandings} viewerId={viewerId} />
		) : null
	) : usersResults.length > 0 ? (
		<GpUsersResultsTable
			data={usersResults}
			isBefore={isBefore}
			viewerId={viewerId}
		/>
	) : null

	const ridersTable =
		ridersResults.length > 0 ? (
			<GpRidersResultsTable data={ridersResults} />
		) : ridersPreview.length > 0 ? (
			<GpRidersPreviewTable data={ridersPreview} isBefore={isBefore} />
		) : null

	return (
		<div className="flex flex-col gap-4">
			{macroStage === EMacroStage.During && <AutoRefresh />}
			{/* Card at mobile width on desktop too; season context beside it */}
			<div className="grid items-start gap-4 md:grid-cols-2">
				<GpCard gp={gp} macroStage={macroStage} imageLoading="eager" />

				<div className="flex flex-col gap-4">
					<GpSeasonProgress year={year} currentGpId={gp.id} />
					{isBefore && (
						<VenueHistory
							gpId={gp.id}
							cityName={gp.city_name}
							viewerId={viewerId}
						/>
					)}
				</div>
			</div>

			{playersTable && ridersTable ? (
				<PlayersRidersToggle
					initialView={view}
					players={playersTable}
					riders={ridersTable}
				/>
			) : playersTable ? (
				<div>
					<SectionTitle>{tCommon('players')}</SectionTitle>
					{playersTable}
				</div>
			) : ridersTable ? (
				<div>
					<SectionTitle>{tCommon('riders')}</SectionTitle>
					{ridersTable}
				</div>
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
