import { Flag } from '@/components/Flag'
import { cn } from '@/lib/utils'

type TFlagNumber = {
	countryCode: string | null | undefined
	number: number | null | undefined
	reverse?: boolean
}

export function FlagNumber({
	countryCode,
	number,
	reverse = false
}: TFlagNumber) {
	return (
		<div className="flex items-center gap-1">
			{countryCode && <Flag className="h-auto w-5" countryCode={countryCode} />}

			{number && (
				<span className={cn('text-muted-foreground', reverse && 'order-first')}>
					{number}
				</span>
			)}
		</div>
	)
}
