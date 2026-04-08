import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'

import { RiderName } from '../RiderName'

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
		<div className="flex items-center justify-center gap-8">
			{riders.map((rider) => (
				<div key={rider.id} className="flex flex-col items-center gap-0.5">
					<RiderImage className="size-8" riderId={rider.id} />

					<RiderName
						name={rider.name.split(' ').pop() ?? ''}
						riderId={rider.id}
					/>

					<FlagNumber countryCode={rider.country_code} number={rider.number} />
				</div>
			))}
		</div>
	)
}
