'use client'

import { Coins } from 'lucide-react'

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
	hideFlagNumber?: boolean
	compact?: boolean
	isSelected?: boolean
	isDimmed?: boolean
	coins?: number | null
	onClick?: () => void
}

export function RiderTile({
	rider,
	className,
	linked = false,
	hideFirstName = false,
	hideFlagNumber = false,
	compact = false,
	isSelected = false,
	isDimmed = false,
	coins,
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
				'relative flex w-full flex-col items-center gap-2 rounded-lg bg-black/40 p-3 transition-all',
				compact && 'gap-1 p-2',
				onClick && 'cursor-pointer',
				isDimmed && 'opacity-40',
				className
			)}
		>
			{coins != null && (
				<span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-yellow-400/15 px-1.5 py-0.5 text-xs leading-none font-black text-yellow-400">
					<Coins className="size-3" />
					{coins}
				</span>
			)}

			<RiderImage
				className={cn(
					compact ? 'size-10' : 'size-14',
					isSelected &&
						'ring-offset-background rounded-full ring-2 ring-green-400 ring-offset-2'
				)}
				name={rider.name}
				riderId={rider.id}
			/>

			<div className="flex w-full min-w-0 flex-1 flex-col items-center gap-0.5">
				{linked ? (
					<RiderName name={nameToRender} riderId={rider.id} />
				) : (
					<span className="w-full truncate text-center text-xs leading-tight">
						{nameToRender}
					</span>
				)}

				{!hideFlagNumber && (
					<FlagNumber countryCode={rider.country_code} number={rider.number} />
				)}
			</div>
		</Comp>
	)
}
