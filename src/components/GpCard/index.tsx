import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, LogIn } from 'lucide-react'

import type { getGps } from '@/app/gps/data'
import { Countdown } from '@/components/Countdown'
import { Flag } from '@/components/Flag'
import { LiveBadge } from '@/components/LiveBadge'
import { StartTimeNote } from '@/components/StartTimeNote'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { WildCardInfoBox } from '@/components/WildCardInfoBox'
import { EMacroStage } from '@/enums'
import { formatDate } from '@/lib/dates'

import { After } from './After'
import { Before } from './Before'
import { getGpRiders, getViewerPicks } from './data'
import { During } from './During'
import { PicksCounter } from './PicksCounter'

type TGpCard = {
	gp: Awaited<ReturnType<typeof getGps>>[number]
	isUpNext?: boolean
	macroStage: EMacroStage
	viewerId?: number
}

export async function GpCard({
	gp,
	isUpNext = false,
	macroStage,
	viewerId
}: TGpCard) {
	const href = `/gps/${gp.id}`

	const [riders, existingPicks] = viewerId
		? await Promise.all([
				getGpRiders(gp.wild_card_id),
				getViewerPicks(gp.id, viewerId)
			])
		: [[], null]

	return (
		<Card
			id={isUpNext ? 'up-next' : undefined}
			className="mx-auto w-full pt-0 font-black"
		>
			<Link className="group relative block" href={href}>
				<Image
					alt=""
					className="relative z-20 aspect-video w-full object-cover brightness-60"
					height={300}
					width={600}
					src={`/cities/${gp?.city_id}.jpg`}
				/>

				<div className="absolute top-3 left-3 z-40">
					{macroStage === EMacroStage.During && <LiveBadge />}

					{isUpNext && gp?.start_date && (
						<Countdown startDate={gp.start_date} />
					)}
				</div>

				<div className="absolute inset-0 z-30 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-colors duration-200 group-hover:bg-black/20" />
				<div className="absolute top-3 right-3 z-40 flex items-center gap-0 overflow-hidden rounded-full bg-black/40 p-1.5 backdrop-blur-sm transition-all duration-300 group-hover:gap-1.5 group-hover:pl-3">
					<span className="max-w-0 overflow-hidden text-xs font-semibold whitespace-nowrap text-orange-400 transition-all duration-300 group-hover:max-w-20">
						View GP
					</span>
					<ArrowRight
						className="size-4 shrink-0 text-orange-400"
						strokeWidth={2.5}
					/>
				</div>

				<div className="absolute inset-0 z-40 flex flex-col justify-end gap-1 p-4">
					<Flag countryCode={gp.country_code} />
					<h3 className="text-2xl uppercase">{gp.city_name}</h3>

					<p className="text-sm font-black uppercase opacity-80">
						Round {gp.round} • {formatDate(gp.start_date, gp.time_zone)}
						<StartTimeNote date={gp.start_date} eventTimeZone={gp.time_zone} />
					</p>
				</div>
			</Link>

			<CardContent className="flex flex-col gap-3">
				{macroStage === EMacroStage.During && (
					<During
						gpId={gp.id}
						heatsFinished={gp.heats_finished ?? 0}
						viewerId={viewerId}
						riders={riders}
						existingPicks={existingPicks ?? null}
					/>
				)}

				{macroStage === EMacroStage.After && (
					<After
						gpId={gp.id}
						viewerId={viewerId}
						riders={riders}
						existingPicks={existingPicks ?? null}
					/>
				)}

				<PicksCounter gpId={gp.id} />

				<WildCardInfoBox
					countryCode={gp.wild_card_country_code}
					name={gp.wild_card_name}
					riderId={gp.wild_card_id}
				/>

				{macroStage === EMacroStage.Before && (
					<Before
						gpId={gp.id}
						gpName={gp.city_name}
						gpRound={gp.round}
						viewerId={viewerId}
						riders={riders}
						existingPicks={existingPicks ?? null}
					/>
				)}
			</CardContent>

			{!viewerId && (
				<CardFooter>
					<Button asChild className="w-full" variant="outline">
						<a href="/auth/login">
							Sign in to pick riders
							<LogIn className="size-4" />
						</a>
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}
