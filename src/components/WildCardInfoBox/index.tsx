import { InfoBox } from '@/components/InfoBox'
import { InfoBoxTitle } from '@/components/InfoBox/Title'
import { RiderInfo } from '@/components/RiderInfo'

type TWildCard = {
	countryCode: string | null | undefined
	name: string | null | undefined
	riderId: number | null | undefined
}

export function WildCardInfoBox({ countryCode, name, riderId }: TWildCard) {
	return (
		<InfoBox>
			<div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
				<InfoBoxTitle>Wild card</InfoBoxTitle>

				<div className="ml-auto">
					{riderId ? (
						<RiderInfo
							countryCode={countryCode}
							name={name}
							number={16}
							riderId={riderId}
						/>
					) : (
						<span className="text-muted-foreground text-xs">TBD</span>
					)}
				</div>
			</div>
		</InfoBox>
	)
}
