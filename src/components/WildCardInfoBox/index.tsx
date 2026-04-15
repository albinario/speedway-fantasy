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
			<div className="flex justify-between">
				<div className="flex items-center gap-4">
					{riderId && (
						<RiderImage className="size-14" name={name} riderId={riderId} />
					)}

					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						{riderId && name ? (
							<>
								<RiderName name={name} riderId={riderId} />
								<FlagNumber countryCode={countryCode} number={16} />
							</>
						) : (
							<span className="text-muted-foreground text-xs">TBD</span>
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
		</InfoBox>
	)
}
