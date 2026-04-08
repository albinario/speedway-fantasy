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
			{countryCode && <Flag countryCode={countryCode} className="w-3.5" />}

			{number && (
				<span className={cn('text-muted-foreground', reverse && 'order-first')}>
					{number}
				</span>
			)}
		</div>
	)
}
