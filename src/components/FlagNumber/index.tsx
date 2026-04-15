import { Flag } from '@/components/Flag'
import { cn } from '@/lib/utils'

type TFlagNumber = {
	countryCode: string | null | undefined
	flagClassName?: string
	highlight?: boolean
	number: number | null | undefined
	reverse?: boolean
}

export function FlagNumber({
	countryCode,
	flagClassName = 'h-auto w-5',
	highlight = false,
	number,
	reverse = false
}: TFlagNumber) {
	return (
		<div
			className={cn(
				'flex items-center gap-1',
				highlight && 'rounded px-1 ring-1 ring-white/30'
			)}
		>
			{countryCode && (
				<Flag className={flagClassName} countryCode={countryCode} />
			)}

			{number && (
				<span
					className={cn(
						'text-muted-foreground text-sm',
						reverse && 'order-first'
					)}
				>
					{number}
				</span>
			)}
		</div>
	)
}
