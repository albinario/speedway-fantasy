import { TGp } from '@/app/gps/data'
import { Countdown } from '@/components/Countdown'
import { Flag } from '@/components/Flag'
import { StartTimeNote } from '@/components/StartTimeNote'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { EMacroStage } from '@/enums'
import { formatDate } from '@/lib/dates'
import { getTimeZoneDiff } from '@/lib/time-zone'

type TGpCard = {
	gp: TGp
	isLoggedIn?: boolean
	macroStage: EMacroStage
}

export async function GpCard({ gp, isLoggedIn, macroStage }: TGpCard) {
	const countdown = false
	const liveBadge = macroStage === EMacroStage.During
	const wildCard = true
	const registeredPicks = macroStage === EMacroStage.Before
	const pickRiders = macroStage === EMacroStage.Before && isLoggedIn
	const inProgress = macroStage === EMacroStage.During
	const ownProgress = macroStage === EMacroStage.During && isLoggedIn
	const finished = macroStage === EMacroStage.After
	const ownResults = macroStage === EMacroStage.After && isLoggedIn

	const timeZoneDiffers = getTimeZoneDiff(gp?.start_date, gp?.time_zone)

	return (
		<Card className="mx-auto w-full pt-0">
			<div className="relative">
				<img
					alt=""
					className="relative z-20 aspect-video w-full object-cover brightness-60"
					src={`/cities/${gp?.city_id}.jpg`}
				/>

				<div className="absolute inset-0 z-40 flex flex-col justify-end gap-1 p-4">
					{countdown && gp?.start_date && (
						<Countdown startDate={gp.start_date} />
					)}

					<div className="flex items-center gap-2">
						<Flag countryCode={gp?.country_code} />

						{liveBadge && (
							<Badge className="rounded-sm bg-red-600 text-white">Live</Badge>
						)}
					</div>

					<h3 className="text-2xl font-black uppercase">{gp?.city_name}</h3>

					<div className="flex flex-wrap items-center gap-2 text-sm">
						<p>
							Round {gp?.round} • {formatDate(gp?.start_date, gp?.time_zone)}
						</p>

						<StartTimeNote
							date={gp?.start_date}
							eventTimeZone={gp?.time_zone}
						/>
					</div>
				</div>
			</div>

			<CardContent>
				{wildCard && (
					<div className="flex items-center gap-2">
						<p>Wild card: {gp?.wild_card_name ?? 'TBD'}</p>
						<Flag countryCode={gp?.wild_card_country_code} />
					</div>
				)}

				{registeredPicks && <p>Registered picks: 0</p>}

				{pickRiders && <p>[pick riders functionality]</p>}

				{inProgress && <p>[show progress]</p>}

				{ownProgress && <p>[see own progress]</p>}

				{finished && <p>[show results]</p>}

				{ownResults && <p>[see own results]</p>}
			</CardContent>

			<CardFooter>
				<Button className="w-full" variant="outline">
					CTA
				</Button>
			</CardFooter>
		</Card>
	)
}
