import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { getGps, getNextGp } from '@/app/gps/data'
import { UserGpCard } from '@/components/GpCard'
import { MyTeamCard } from '@/components/MyTeamCard'
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

export async function generateMetadata({
	params
}: Pick<TUserPage, 'params'>): Promise<Metadata> {
	const { id } = await params
	const [user, t] = await Promise.all([
		getUser(Number(id)),
		getTranslations('DetailPages')
	])
	if (!user) return {}

	const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
	return {
		title: t('user.title', { name }),
		description: t('user.description', { name })
	}
}

export default async function UserPage({ params, searchParams }: TUserPage) {
	const { id } = await params
	const userId = Number(id)

	const currentYear = new Date().getFullYear()
	const [user, yearValues, viewer, resultGpIds, nextGp, t] = await Promise.all([
		getUser(userId),
		getYearValues(searchParams, currentYear),
		getViewer(),
		getUserResultGpIds(userId),
		getNextGp(),
		getTranslations('Common')
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

			{nextGp &&
				viewer.db?.id === userId &&
				yearValues.activeYear === new Date(nextGp.start_date).getFullYear() && (
					<MyTeamCard
						gpId={nextGp.id}
						gpStartDate={nextGp.start_date}
						viewerId={userId}
					/>
				)}

			{[
				{ title: t('upcoming'), items: upcoming },
				{ title: t('results'), items: finished }
			].map(
				({ title, items }) =>
					items.length > 0 && (
						<section key={title} className="flex flex-col gap-1">
							<SectionTitle>{title}</SectionTitle>

							<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-4">
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
