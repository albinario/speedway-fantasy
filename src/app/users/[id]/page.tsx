import { getGps } from '@/app/gps/data'
import { UserGpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { ShowOlderToggle } from '@/components/ShowOlderToggle'
import { UserAvatar } from '@/components/UserAvatar'
import { UserHero } from '@/components/UserHero'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'
import { filterGps } from '@/lib/filter-gps'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { getUser, getUserResultGpIds } from './data'

type TUserPage = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ year?: string | TParamValues; show?: string }>
}

export default async function UserPage({ params, searchParams }: TUserPage) {
	const { id } = await params
	const userId = Number(id)
	const { show } = await searchParams

	const [user, yearValues, viewer, resultGpIds] = await Promise.all([
		getUser(userId),
		getYearValues(searchParams),
		getViewer(),
		getUserResultGpIds(userId)
	])

	if (!user) return null

	const gps = await getGps(yearValues.activeYear)

	const showAll = show === 'all'
	const isPastYear = Number(yearValues.activeYear) < new Date().getFullYear()
	const { visible, showToggle, isUpNext } = filterGps(
		gps,
		showAll,
		isPastYear,
		new Set(resultGpIds.map((r) => r.gp_id))
	)

	const gpGrid = (
		<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
			{visible.map(({ gp, stage }, i) => (
				<UserGpCard
					key={gp.id}
					gp={gp}
					isUpNext={i === isUpNext}
					macroStage={stage}
					userId={userId}
					viewerId={viewer.db?.id}
				/>
			))}
		</div>
	)

	return (
		<div className="flex flex-col gap-4">
			<PageHeader>
				<div className="flex items-center gap-2">
					<UserAvatar
						firstName={user.first_name}
						lastName={user.last_name}
						className="size-12 shrink-0"
					/>
					<UserName
						className="text-xl font-black uppercase"
						firstName={user.first_name}
						lastName={user.last_name}
						stars={user.stars}
						userId={userId}
					/>
				</div>
			</PageHeader>

			<UserHero
				userId={userId}
				year={yearValues.activeYear}
				createdAt={user.created_at}
			/>

			{showToggle ? (
				<ShowOlderToggle checked={showAll}>{gpGrid}</ShowOlderToggle>
			) : (
				gpGrid
			)}
		</div>
	)
}
