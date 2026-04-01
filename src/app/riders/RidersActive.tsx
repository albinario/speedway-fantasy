import Link from 'next/link'

import { Flag } from '@/components/Flag'
import { RiderImage } from '@/components/RiderImage'
import { Card } from '@/components/ui/card'

import type { getRidersActive } from './data'

type TRidersActive = {
	riders: Awaited<ReturnType<typeof getRidersActive>>
}

export function RidersActive({ riders }: TRidersActive) {
	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
			{riders.map((rider) => (
				<Link key={rider.id} href={`/riders/${rider.id}`}>
					<Card className="bg-transparent p-4 text-center">
						<div className="flex flex-col items-center gap-2">
							{rider.id && <RiderImage className="size-20" riderId={rider.id} />}
							<div className="flex flex-col items-center gap-0.5">
								<span className="text-xs uppercase">{rider.name}</span>
								<div className="flex items-center gap-1">
									<Flag countryCode={rider.country_code} className="w-3.5" />
									<span className="text-muted-foreground">{rider.number}</span>
								</div>
							</div>
						</div>
					</Card>
				</Link>
			))}
		</div>
	)
}
