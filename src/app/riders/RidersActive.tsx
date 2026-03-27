import { Flag } from '@/components/Flag'
import { Card } from '@/components/ui/card'

import type { getRidersActive } from './data'
import { RiderAvatar } from './RiderAvatar'

type TRidersActive = {
	riders: Awaited<ReturnType<typeof getRidersActive>>
}

export function RidersActive({ riders }: TRidersActive) {
	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
			{riders.map((rider) => (
				<Card key={rider.id} className="p-4 text-center">
					<div className="flex flex-col items-center gap-2">
						{rider.id && <RiderAvatar id={rider.id} />}

						<div>
							<div className="text-sm leading-tight font-black uppercase">
								{rider.name}
							</div>

							<div className="mt-1 flex items-center justify-center gap-1">
								<Flag countryCode={rider.country_code} />

								<span className="text-muted-foreground text-xs">
									#{rider.number}
								</span>
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	)
}
