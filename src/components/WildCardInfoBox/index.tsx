import { Sparkles } from 'lucide-react'

import { FlagNumber } from '@/components/FlagNumber'
import { InfoBox } from '@/components/InfoBox'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { Badge } from '@/components/ui/badge'

type TWildCard = {
	countryCode: string | null | undefined
	name: string | null | undefined
	riderId: number | null | undefined
}

export function WildCardInfoBox({ countryCode, name, riderId }: TWildCard) {
	return (
		<InfoBox>
			<div className="flex items-center gap-3">
				{riderId && <RiderImage className="size-14" riderId={riderId} />}

				<div className="flex flex-col gap-0.5">
					{riderId && name ? (
						<RiderName name={name} riderId={riderId} />
					) : (
						<span className="text-muted-foreground text-xs">TBD</span>
					)}
					<FlagNumber countryCode={countryCode} number={16} />
				</div>

				<Badge variant="warning" className="ml-auto text-sm font-black uppercase">
					<Sparkles />
					Wild card
				</Badge>
			</div>
		</InfoBox>
	)
}
