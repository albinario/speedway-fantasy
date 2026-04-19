import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { Badge } from '@/components/ui/badge'

type TWildCard = {
	countryCode: string | null | undefined
	name: string | null | undefined
	riderId: number
}

export function WildCard({ countryCode, name, riderId }: TWildCard) {
	return (
		<div className="flex justify-between">
			<div className="flex items-center gap-4">
				<RiderImage className="size-12" name={name} riderId={riderId} />

				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					{name && (
						<>
							<RiderName name={name} riderId={riderId} />
							<FlagNumber countryCode={countryCode} number={16} />
						</>
					)}
				</div>
			</div>

			<Badge
				variant="warning"
				className="gap-1 self-start font-black whitespace-normal uppercase"
			>
				Wild card
			</Badge>
		</div>
	)
}
