'use client'

import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { cn } from '@/lib/utils'

export type TRider = {
	id: number
	name: string
	number: number
	country_code: string | null
}

type TRiderTile = {
	rider: TRider
	className?: string
	linked?: boolean
	hideFirstName?: boolean
	isSelected?: boolean
	isDimmed?: boolean
	onClick?: () => void
}

export function RiderTile({
	rider,
	className,
	linked = false,
	hideFirstName = false,
	isSelected = false,
	isDimmed = false,
	onClick
}: TRiderTile) {
	const Comp = onClick ? 'button' : 'div'

	const nameToRender = hideFirstName
		? (rider.name.split(' ').pop() ?? '')
		: rider.name

	return (
		<Comp
			{...(onClick ? { type: 'button' as const, onClick } : {})}
			className={cn(
				'relative flex flex-col items-center gap-2 rounded-lg bg-black/40 p-3 transition-all',
				onClick && 'cursor-pointer',
				isDimmed && 'opacity-40',
				className
			)}
		>
			<RiderImage
				className={cn(
					'size-14',
					isSelected &&
						'ring-offset-background rounded-full ring-2 ring-green-400 ring-offset-2'
				)}
				name={rider.name}
				riderId={rider.id}
			/>

			<div className="flex w-full flex-1 flex-col items-center gap-0.5">
				{linked ? (
					<RiderName name={nameToRender} riderId={rider.id} />
				) : (
					<span className="w-full text-center text-xs leading-tight">
						{nameToRender}
					</span>
				)}

				<FlagNumber countryCode={rider.country_code} number={rider.number} />
			</div>
		</Comp>
	)
}
