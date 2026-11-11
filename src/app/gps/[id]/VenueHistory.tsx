import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

import { ChevronRight, Sparkles } from 'lucide-react'

import { GpResultSummaryBody } from '@/components/GpResultSummary'
import { Card, CardContent, CardGlow } from '@/components/ui/card'

import { getGpVenueHistory } from './data'

type TVenueHistory = {
	gpId: number
	cityName: string
	viewerId?: number
}

type THistory = NonNullable<Awaited<ReturnType<typeof getGpVenueHistory>>>

type TVenueHistoryBody = {
	history: THistory | null
	cityName: string
	viewerId?: number
}

/** The venue history itself, with no card around it. null = first visit. */
async function VenueHistoryBody({
	history,
	cityName,
	viewerId
}: TVenueHistoryBody) {
	const [t, tHome] = await Promise.all([
		getTranslations('VenueHistory'),
		getTranslations('Home')
	])

	if (history === null) {
		return (
			<div className="flex items-center gap-3">
				<Sparkles className="text-gold size-5 shrink-0" />
				<span className="text-muted-foreground text-sm">
					{t('noPreviousResults')}
				</span>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-baseline justify-between gap-2">
				<span className="text-xs font-bold tracking-wide uppercase">
					{t('lastTimeIn', { city: cityName })}{' '}
					<span className="text-muted-foreground">{history.year}</span>
				</span>

				<Link
					className="text-brand-red flex shrink-0 items-center text-sm"
					href={`/gps/${history.gpId}`}
				>
					{tHome('viewGp')} <ChevronRight className="size-4" />
				</Link>
			</div>

			<GpResultSummaryBody summary={history} viewerId={viewerId} />
		</div>
	)
}

/** Venue history without its own card, for use inside a GP card body. */
export async function VenueHistoryContent({ gpId, ...rest }: TVenueHistory) {
	const history = await getGpVenueHistory(gpId)

	// Query failed: show nothing rather than wrongly claiming a first visit
	if (history === undefined) return null

	return <VenueHistoryBody history={history} {...rest} />
}

/** Venue history in its own gold card (GP page, beside the GP card). */
export async function VenueHistory({ gpId, ...rest }: TVenueHistory) {
	const history = await getGpVenueHistory(gpId)

	// Query failed: show nothing rather than wrongly claiming a first visit
	if (history === undefined) return null

	return (
		<Card className="relative isolate">
			<CardGlow color="gold" />
			<CardContent className="pt-4">
				<VenueHistoryBody history={history} {...rest} />
			</CardContent>
		</Card>
	)
}
