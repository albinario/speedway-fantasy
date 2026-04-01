import { InfoBox } from '@/components/InfoBox'
import { RiderInfo } from '@/components/RiderInfo'

type TWildCard = {
	countryCode: string | null | undefined
	name: string | null | undefined
	riderId: number | null | undefined
}

export function WildCardInfoBox({ countryCode, name, riderId }: TWildCard) {
	return (
		<InfoBox className="flex justify-between">
			<span className="text-muted-foreground text-xs">Wild card</span>
			<RiderInfo
				name={name}
				countryCode={countryCode}
				number={16}
				riderId={riderId}
			/>
		</InfoBox>
	)
}
