import { Flag } from '@/components/Flag'
import { RiderPlaceholder } from '@/components/PickRiders'
import { RiderImage } from '@/components/RiderImage'

type TRiderInfo = {
	name: string | null | undefined
	countryCode: string | null | undefined
	number: number | null | undefined
	riderId: number | null | undefined
}

export function RiderInfo({ name, countryCode, number, riderId }: TRiderInfo) {
	return (
		<div className="flex items-center gap-2">
			<div className="flex flex-col items-end gap-0.5">
				<span className="truncate text-xs font-black uppercase">{name ?? 'TBD'}</span>
				<div className="flex items-center gap-1">
					{countryCode && <Flag countryCode={countryCode} className="w-3.5" />}
					{number && <span className="text-muted-foreground">{number}</span>}
				</div>
			</div>
			{riderId ? (
				<RiderImage className="size-8" riderId={riderId} />
			) : (
				<RiderPlaceholder className="size-8" />
			)}
		</div>
	)
}
