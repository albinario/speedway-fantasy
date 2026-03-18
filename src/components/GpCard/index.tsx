import { Fragment } from 'react/jsx-runtime'

import { getGp, TGp } from '@/app/gps/data'
import { Countdown } from '@/components/Countdown'
import { Flag } from '@/components/Flag'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { formatDate } from '@/lib/dates'

export enum EStage {
	BEFORE = 'before',
	DURING = 'during',
	AFTER = 'after'
}

type TGpCard = {
	gp: TGp
	stage: EStage
	isLoggedIn?: boolean
	showCountdown?: boolean
}

export async function GpCard({
	gp,
	showCountdown,
	stage,
	isLoggedIn
}: TGpCard) {
	return (
		<Card className="relative mx-auto w-full pt-0">
			<div className="absolute inset-0 z-30 aspect-video bg-black/35" />

			<img
				alt=""
				className="relative z-20 aspect-video w-full object-cover"
				src={`/cities/${gp?.city_id}.jpg`}
			/>

			<CardHeader>
				{showCountdown && gp?.start_date && isLoggedIn && (
					<CardAction>
						<Countdown startDate={gp.start_date} />
					</CardAction>
				)}

				<CardTitle className="flex items-center gap-2">
					<Flag countryCode={gp?.country_code} />
					<span>
						{gp?.gp_number}. {gp?.city_name}
					</span>
				</CardTitle>

				<CardDescription>{formatDate(gp?.start_date)}</CardDescription>
			</CardHeader>

			<CardContent>
				<p>Wild card: {gp?.wild_card_name ?? 'TBD'}</p>

				{stage === EStage.BEFORE && <p>Registered picks: 0</p>}

				{stage === EStage.BEFORE && isLoggedIn && (
					<p>[pick riders functionality here]</p>
				)}
			</CardContent>

			<CardFooter>
				<Button className="w-full" variant="outline">
					CTA
				</Button>
			</CardFooter>
		</Card>
	)
}
