'use client'

import { FlagNumber } from '@/components/FlagNumber'
import { RiderImage } from '@/components/RiderImage'
import { cn } from '@/lib/utils'

import type { TPickRider } from './Sheet'

type TRiderTile = {
	rider: TPickRider
	slotIndex: number // -1 if not selected
	isDimmed: boolean
	onClick: () => void
}

export function RiderTile({ rider, slotIndex, isDimmed, onClick }: TRiderTile) {
	const isSelected = slotIndex !== -1

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'relative flex cursor-pointer flex-col items-center gap-1 rounded-lg p-2 transition-all',
				isDimmed && 'opacity-40',
				isSelected && 'bg-muted/50'
			)}
		>
			<div className="relative">
				<RiderImage
					className={cn(
						'size-14',
						isSelected &&
							'ring-offset-card rounded-full ring-2 ring-green-400 ring-offset-2'
					)}
					riderId={rider.id}
				/>
				{isSelected && (
					<span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-xs">
						{slotIndex + 1}
					</span>
				)}
			</div>

			<div className="flex w-full flex-col items-center gap-0.5">
				<span className="w-full truncate text-center text-xs leading-tight uppercase">
					{rider.name.split(' ').pop()}
				</span>
				<FlagNumber countryCode={rider.country_code} number={rider.number} reverse />
			</div>
		</button>
	)
}
