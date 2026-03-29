import { RiderInfo } from '@/components/RiderInfo'

type TWildCard = {
	countryCode: string | null | undefined
	name: string | null | undefined
	riderId: number | null | undefined
}

export function WildCardInfoBox({ countryCode, name, riderId }: TWildCard) {
	return (
		<div className="bg-muted/50 flex items-start justify-between rounded-md px-3 py-2">
			<span className="text-muted-foreground text-sm">Wild card</span>
			<RiderInfo
				name={name}
				countryCode={countryCode}
				number={16}
				riderId={riderId}
			/>
		</div>
	)
}
