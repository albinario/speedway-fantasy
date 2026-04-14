import { getGps } from '@/app/gps/data'
import { UserGpCard } from '@/components/GpCard'
import { PageTitle } from '@/components/PageTitle'
import { YearSelector } from '@/components/YearSelector'
import { EMacroStage } from '@/enums'
import { getMacroStage } from '@/lib/dates'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { getUser } from './data'

type TUserPage = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ year?: string | TParamValues }>
}

export default async function UserPage({ params, searchParams }: TUserPage) {
	const { id } = await params
	const userId = Number(id)

	const [user, yearValues] = await Promise.all([
		getUser(userId),
		getYearValues(searchParams)
	])

	if (!user) return null

	const gps = await getGps(yearValues.activeYear)

	const stages = gps.map((gp) => getMacroStage(gp.start_date, gp.finished))
	const isUpNext = stages.indexOf(EMacroStage.Before)

	return (
		<>
			<div className="flex items-center justify-between py-4">
				<PageTitle title={`${user.first_name} ${user.last_name}`} />
				<YearSelector yearValues={yearValues} />
			</div>

			<div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{gps.map((gp, i) => (
					<UserGpCard
						key={gp.id}
						gp={gp}
						isUpNext={i === isUpNext}
						userId={userId}
					/>
				))}
			</div>
		</>
	)
}
