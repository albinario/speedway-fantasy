import { getGps } from '@/app/gps/data'
import { UserGpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { SectionTitle } from '@/components/SectionHeader'
import { UserAvatar } from '@/components/UserAvatar'
import { UserHero } from '@/components/UserHero'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'
import { groupGps } from '@/lib/group-gps'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { getUser, getUserResultGpIds } from './data'

type TUserPage = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ year?: string | TParamValues }>
}

export default async function UserPage({ params, searchParams }: TUserPage) {
	const { id } = await params
	const userId = Number(id)

	const currentYear = new Date().getFullYear()
	const [user, yearValues, viewer, resultGpIds] = await Promise.all([
		getUser(userId),
		getYearValues(searchParams, currentYear),
		getViewer(),
		getUserResultGpIds(userId)
	])

	if (!user) return null

	const gps = await getGps(yearValues.activeYear)

	const { upcoming, finished, upNextId } = groupGps(
		gps,
		new Set(resultGpIds.map((r) => r.gp_id))
	)

	return (
		<div className="flex flex-col gap-4">
			<PageHeader defaultYear={currentYear}>
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

			{[
				{ title: 'Upcoming', items: upcoming },
				{ title: 'Results', items: finished }
			].map(
				({ title, items }) =>
					items.length > 0 && (
						<section key={title} className="flex flex-col gap-1">
							<SectionTitle>{title}</SectionTitle>

							<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
								{items.map(({ gp, stage }) => (
									<UserGpCard
										key={gp.id}
										gp={gp}
										isUpNext={gp.id === upNextId}
										macroStage={stage}
										userId={userId}
										viewerId={viewer.db?.id}
									/>
								))}
							</div>
						</section>
					)
			)}
		</div>
	)
}
