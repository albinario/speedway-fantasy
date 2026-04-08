import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { RiderPlaceholder } from '@/components/RiderPlaceholder'
import { cn } from '@/lib/utils'

type TRiderInfo = {
	className?: string
	countryCode: string | null | undefined
	imageSize?: number
	name: string | null | undefined
	number: number | null | undefined
	riderId: number | null | undefined
	stack?: boolean
}

export function RiderInfo({
	className,
	countryCode,
	imageSize = 8,
	name,
	number,
	riderId,
	stack = false
}: TRiderInfo) {
	return (
		<div
			className={cn(
				'flex items-center gap-0.5',
				className,
				stack ? 'flex-col' : 'gap-2'
			)}
		>
			{riderId && (
				<RiderImage className={`size-${imageSize}`} riderId={riderId} />
			)}

			<div
				className={cn(
					'flex flex-col gap-0.5',
					stack ? 'items-center' : 'order-first items-end'
				)}
			>
				{riderId && name && <RiderName name={name} riderId={riderId} />}

				<FlagNumber countryCode={countryCode} number={number} />
			</div>
		</div>
	)
}
