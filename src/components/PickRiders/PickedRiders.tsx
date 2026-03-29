import { Flag } from '@/components/Flag'
import { RiderImage } from '@/components/RiderImage'

export type TPickedRider = {
	id: number
	name: string
	number: number
	country_code: string | null
}

type TPickedRiders = {
	riders: TPickedRider[]
}

export function PickedRiders({ riders }: TPickedRiders) {
	return (
		<div className="flex items-center justify-center gap-6">
			{riders.map((rider) => (
				<div key={rider.id} className="flex flex-col items-center gap-0.5">
					<RiderImage className="size-8" riderId={rider.id} />
					<span className="text-xs font-black uppercase">
						{rider.name.split(' ').pop()}
					</span>
					<div className="flex items-center gap-1">
						<Flag countryCode={rider.country_code} className="w-3.5" />
						<span className="text-muted-foreground">{rider.number}</span>
					</div>
				</div>
			))}
		</div>
	)
}
