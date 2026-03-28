import { Flag } from '@/components/Flag'
import { InfoBox } from '@/components/InfoBox'
import { RiderImage } from '@/components/RiderImage'

type TWildCard = {
	asCard?: boolean
	countryCode: string | null | undefined
	name: string | null | undefined
	riderId: number | null | undefined
}

export function GpWildCard({
	asCard = false,
	countryCode,
	name,
	riderId
}: TWildCard) {
	return (
		<InfoBox
			asCard={asCard}
			className="flex-row items-center justify-between text-sm"
		>
			<span className="text-muted-foreground">Wild card</span>

			{name ? (
				<div className="flex items-center gap-2">
					{riderId && <RiderImage className="size-8" riderId={riderId} />}
					<span className="uppercase">{name}</span>
					<Flag countryCode={countryCode} />
				</div>
			) : (
				<span className="text-muted-foreground">TBD</span>
			)}
		</InfoBox>
	)
}
