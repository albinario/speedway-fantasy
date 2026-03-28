import Image from 'next/image'
import Link from 'next/link'

import { ChevronRight } from 'lucide-react'

import type { getGps } from '@/app/gps/data'
import { Countdown } from '@/components/Countdown'
import { Flag } from '@/components/Flag'
import { GpWildCard } from '@/components/GpWildCard'
import { LiveBadge } from '@/components/LiveBadge'
import { StartTimeNote } from '@/components/StartTimeNote'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { EMacroStage } from '@/enums'
import { formatDate } from '@/lib/dates'

import { After } from './After'
import { Before } from './Before'
import { getPicksCount, getPicksRecord } from './data'
import { During } from './During'
import { PicksCounter } from './PicksCounter'

type TGpCard = {
	gp: Awaited<ReturnType<typeof getGps>>[number]
	isLoggedIn?: boolean
	isUpNext?: boolean
	macroStage: EMacroStage
	viewerId?: number
}

export async function GpCard({
	gp,
	isLoggedIn = false,
	isUpNext = false,
	macroStage,
	viewerId
}: TGpCard) {
	const [{ count: picksCount }, { record: picksRecord }] = await Promise.all([
		getPicksCount(gp.id),
		getPicksRecord()
	])
	const href = `/gps/${gp.id}`

	return (
		<Card id={isUpNext ? 'up-next' : undefined} className="mx-auto w-full pt-0 font-black">
			<Link className="relative block" href={href}>
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

				<div className="absolute inset-0 z-30 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

				<div className="absolute inset-0 z-40 flex flex-col justify-end gap-1 p-4">
					<Flag countryCode={gp.country_code} />
					<h3 className="text-2xl uppercase">{gp.city_name}</h3>

					<p className="text-sm font-normal opacity-80">
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
					/>
				)}

				{macroStage === EMacroStage.After && (
					<After gpId={gp.id} viewerId={viewerId} />
				)}

				<GpWildCard
					countryCode={gp.wild_card_country_code}
					name={gp.wild_card_name}
					riderId={gp.wild_card_id}
				/>

				<PicksCounter
					isOpen={macroStage === EMacroStage.Before}
					picksCount={picksCount}
					picksRecord={picksRecord}
				/>

				{macroStage === EMacroStage.Before && (
					<Before isLoggedIn={isLoggedIn} isUpNext={isUpNext} />
				)}
			</CardContent>

			<CardFooter>
				<Button asChild className="w-full" variant="outline">
					<Link href={href}>
						View GP
						<ChevronRight className="size-4" />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
