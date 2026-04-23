import { getGps } from '@/app/gps/data'
import { UserGpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { UserAvatar } from '@/components/UserAvatar'
import { UserHero } from '@/components/UserHero'
import { UserViewerBar } from '@/components/UserHero/UserViewerBar'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'
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

	const [user, yearValues, viewer] = await Promise.all([
		getUser(userId),
		getYearValues(searchParams),
		getViewer()
	])

	if (!user) return null

	const gps = await getGps(yearValues.activeYear)

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

			{viewer.db?.id === userId && (
				<div className="flex justify-end px-3 sm:px-0">
					<UserViewerBar reminder={viewer.db.reminder} />
				</div>
			)}

			<UserHero userId={userId} year={yearValues.activeYear} />

			<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
				{gps.map((gp) => (
					<UserGpCard
						key={gp.id}
						gp={gp}
						userId={userId}
						viewerId={viewer.db?.id}
					/>
				))}
			</div>
		</div>
	)
}
