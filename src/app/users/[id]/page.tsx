import { getGps } from '@/app/gps/data'
import { UserGpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { UserHero } from '@/components/UserHero'
import { UserViewerBar } from '@/components/UserHero/UserViewerBar'
import { UserName } from '@/components/UserName'
import { getUserStandingRow } from '@/components/UsersStandings/data'
import { EMacroStage } from '@/enums'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMacroStage } from '@/lib/dates'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { getUser, getUserStars } from './data'

type TUserPage = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ year?: string | TParamValues }>
}

export default async function UserPage({ params, searchParams }: TUserPage) {
	const { id } = await params
	const userId = Number(id)

	const [user, yearValues, viewer] = await Promise.all([
		getUser(userId),
		getYearValues(searchParams),
		getViewer()
	])

	if (!user) return null

	const [gps, standings, starRecords] = await Promise.all([
		getGps(yearValues.activeYear),
		getUserStandingRow(yearValues.activeYear, userId),
		getUserStars(userId)
	])

	const stages = gps.map((gp) => getMacroStage(gp.start_date, gp.finished))
	const isUpNext = stages.indexOf(EMacroStage.Before)

	return (
		<>
			<PageHeader>
				<UserName
					className="text-xl font-black uppercase"
					firstName={user.first_name}
					lastName={user.last_name}
					stars={user.stars}
					userId={userId}
				/>
			</PageHeader>

			<div className="flex flex-col gap-4">
				<UserHero starRecords={starRecords} />
				{viewer.db?.id === userId && (
					<UserViewerBar reminder={viewer.db.reminder} />
				)}

				<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
					{gps.map((gp, i) => (
						<UserGpCard
							key={gp.id}
							gp={gp}
							isUpNext={i === isUpNext}
							userId={userId}
						/>
					))}
				</div>
			</div>
		</>
	)
}
