import { RiderTile } from '@/components/RiderTile'

import type { getRidersActive } from './data'

type TRidersActive = {
	riders: Awaited<ReturnType<typeof getRidersActive>>
}

export function RidersActive({ riders }: TRidersActive) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{riders
				.flatMap((r) =>
					r.id != null && r.name != null && r.number != null
						? [
								{
									id: r.id,
									name: r.name,
									number: r.number,
									country_code: r.country_code
								}
							]
						: []
				)
				.map((rider) => (
					<RiderTile key={rider.id} rider={rider} linked />
				))}
		</div>
	)
}
