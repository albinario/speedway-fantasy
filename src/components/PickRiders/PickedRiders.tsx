import { RiderInfo } from '@/components/RiderInfo'

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
		<div className="flex items-center justify-end gap-6">
			{riders.map((rider) => (
				<RiderInfo
					key={rider.id}
					countryCode={rider.country_code}
					imageSize={14}
					name={rider.name.split(' ').pop() ?? ''}
					number={rider.number}
					riderId={rider.id}
					stack
				/>
			))}
		</div>
	)
}
