import Link from 'next/link'

import { Flag } from '@/components/Flag'
import { Image } from '@/components/Image'
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
					<Card className="bg-transparent p-4 text-center font-black">
						<div className="flex flex-col items-center gap-2">
							{rider.id && (
								<Image
									className="size-20 rounded-full object-cover"
									fallbackSrc="/icon-alt-rider.png"
									height={400}
									width={400}
									src={`/riders/${rider.id}.png`}
								/>
							)}

							<div className="uppercase">{rider.name}</div>

							<div className="flex items-center justify-center gap-1">
								<Flag countryCode={rider.country_code} />
								<span>{rider.number}</span>
							</div>
						</div>
					</Card>
				</Link>
			))}
		</div>
	)
}
