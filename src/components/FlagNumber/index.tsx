import { Flag } from '@/components/Flag'
import { cn } from '@/lib/utils'

type TFlagNumber = {
	countryCode: string | null | undefined
	highlight?: boolean
	number: number | null | undefined
	reverse?: boolean
	size?: 'xs' | 'sm'
}

export function FlagNumber({
	countryCode,
	highlight = false,
	number,
	reverse = false,
	size = 'sm'
}: TFlagNumber) {
	return (
		<div
			className={cn(
				'flex items-center gap-1',
				highlight && 'rounded px-1 ring-1 ring-white/30'
			)}
		>
			{countryCode && (
				<Flag
					className={size === 'sm' ? 'w-6' : 'w-4'}
					countryCode={countryCode}
				/>
			)}

			{number && (
				<span
					className={cn(
						'text-muted-foreground',
						`text-${size}`,
						reverse && 'order-first'
					)}
				>
					{number}
				</span>
			)}
		</div>
	)
}
