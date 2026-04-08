import { RiderInfo } from '@/components/RiderInfo'
import { Card } from '@/components/ui/card'

import type { getRidersActive } from './data'

type TRidersActive = {
	riders: Awaited<ReturnType<typeof getRidersActive>>
}

export function RidersActive({ riders }: TRidersActive) {
	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
			{riders.map((rider) => (
				<Card
					key={rider.id}
					className="flex items-center justify-center bg-transparent p-4"
				>
					<RiderInfo
						countryCode={rider.country_code}
						imageSize={20}
						name={rider.name}
						number={rider.number}
						riderId={rider.id}
						stack
					/>
				</Card>
			))}
		</div>
	)
}
