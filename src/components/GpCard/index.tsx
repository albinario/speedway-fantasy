import { getGp } from '@/app/gps/data'
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
	CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/lib/dates'

type TGpCard = {
	gpId: number
}

export async function GpCard({ gpId }: TGpCard) {
	const gp = await getGp(gpId)

	return (
		<Card className="max-w-sm mx-auto pt-0 relative w-full">
			<div className="absolute aspect-video bg-black/35 inset-0 z-30" />

			<img
				alt=""
				className="aspect-video relative object-cover w-full z-20"
				src={`/cities/${gp?.city_id}.jpg`}
			/>

			<CardHeader>
				{gp?.start_date && !gp?.finished && (
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

			<CardContent>Wild card: {gp?.wild_card_name ?? 'TBD'}</CardContent>

			<CardFooter>
				<Button className="w-full">View Event</Button>
			</CardFooter>
		</Card>
	)
}
