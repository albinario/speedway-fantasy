import { Suspense } from 'react'

import { getTranslations } from 'next-intl/server'

import { getLatestGp, getNextGp } from '@/app/gps/data'
import { HallOfFameCard } from '@/app/hall-of-fame/Card'
import { getLatestHallOfFame } from '@/app/hall-of-fame/data'
import { GpCard } from '@/components/GpCard'
import { GpSeasonProgress } from '@/components/GpSeasonProgress'
import { HomeIntro } from '@/components/HomeIntro'
import { HomeLeaderPodium } from '@/components/HomeLeaderPodium'
import { MyTeamCard } from '@/components/MyTeamCard'
import { Season2027AnnouncementCard } from '@/components/Season2027AnnouncementCard'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import { accent } from '@/i18n/rich'
import { getViewer } from '@/lib/auth/get-viewer'
import { cn } from '@/lib/utils'
import { getYearValues } from '@/lib/year'

function SectionFallback() {
	return <Card className="h-48 animate-pulse" />
}

function msFromNow(date: Date | string | null | undefined): number {
	if (!date) return Infinity
	return Math.abs(new Date(date).getTime() - Date.now())
}

export default async function Home() {
	const [yearValues, nextGp, latestGp, latestHallOfFame, viewer, t, tNav] =
		await Promise.all([
			getYearValues(Promise.resolve({})),
			getNextGp(),
			getLatestGp(),
			getLatestHallOfFame(),
			getViewer(),
			getTranslations('Home'),
			getTranslations('Nav')
		])

	const viewerId = viewer?.db?.id
	const latestHofYear = latestHallOfFame?.[0]?.year

	const nextGpIsCloser =
		msFromNow(nextGp?.start_date) <= msFromNow(latestGp?.start_date)

	// The season of the most recently started GP: last year's podium stays up
	// until the new season's first GP starts
	const podiumYear = latestGp?.start_date
		? new Date(latestGp.start_date).getFullYear()
		: yearValues.activeYear

	// The 2027 announcement goes away once the first 2027 GP has started
	const showSeason2027Announcement = !(
		latestGp?.start_date && new Date(latestGp.start_date).getFullYear() >= 2027
	)

	// Same rule as My page: only show the team for the current year's season
	const isTeamSeason =
		!!nextGp?.start_date &&
		new Date(nextGp.start_date).getFullYear() === new Date().getFullYear()

	const isSeasonFinished =
		latestGp?.finished === true && (!nextGp || nextGp.round === 1)

	return (
		<div className="flex flex-col gap-4">
			<HomeIntro isAuthenticated={viewer.isAuthenticated} />

			{showSeason2027Announcement && <Season2027AnnouncementCard />}

			{nextGp && viewerId && isTeamSeason && (
				<Suspense fallback={null}>
					<MyTeamCard
						gpId={nextGp.id}
						gpStartDate={nextGp.start_date}
						viewerId={viewerId}
					/>
				</Suspense>
			)}

			<Suspense fallback={<SectionFallback />}>
				<HomeLeaderPodium
					isFinal={isSeasonFinished}
					viewerId={viewerId}
					year={podiumYear}
				/>
			</Suspense>

			<Suspense fallback={<Card className="h-14 animate-pulse" />}>
				<GpSeasonProgress />
			</Suspense>

			<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
				{nextGp && (
					<div className={cn(nextGpIsCloser ? 'order-1' : 'order-2')}>
						<SectionTitle href={`/gps/${nextGp.id}`} linkLabel={t('viewGp')}>
							{t.rich('nextGp', { accent })}
						</SectionTitle>

						<Suspense fallback={<SectionFallback />}>
							<GpCard gp={nextGp} isUpNext linked imageLoading="eager" />
						</Suspense>
					</div>
				)}

				{latestGp && (
					<div className={cn(nextGpIsCloser ? 'order-2' : 'order-1')}>
						<SectionTitle href={`/gps/${latestGp.id}`} linkLabel={t('viewGp')}>
							{t.rich('previousGp', { accent })}
						</SectionTitle>

						<Suspense fallback={<SectionFallback />}>
							<GpCard gp={latestGp} linked imageLoading="eager" />
						</Suspense>
					</div>
				)}
			</div>

			{!isSeasonFinished && nextGp?.round !== 1 && latestHofYear && (
				<div>
					<SectionTitle href="/hall-of-fame" linkLabel={tNav('hallOfFame')}>
						{t.rich('previousSeason', { accent })}
					</SectionTitle>

					<HallOfFameCard entries={latestHallOfFame} glow viewerId={viewerId} />
				</div>
			)}
		</div>
	)
}
