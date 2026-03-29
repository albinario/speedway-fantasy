'use client'

import { Flag } from '@/components/Flag'
import { RiderImage } from '@/components/RiderImage'
import { cn } from '@/lib/utils'

import type { TPickRider } from './PickRidersSheet'

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
				'relative flex flex-col items-center gap-1 rounded-lg p-2 transition-all cursor-pointer',
				isDimmed && 'opacity-40',
				isSelected && 'bg-muted/50'
			)}
		>
			<div className="relative">
				<RiderImage
					className={cn(
						'size-14',
						isSelected && 'ring-2 ring-green-400 ring-offset-2 ring-offset-card rounded-full'
					)}
					riderId={rider.id}
				/>
				{isSelected && (
					<span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
						{slotIndex + 1}
					</span>
				)}
			</div>

			<div className="flex flex-col items-center gap-0.5 w-full">
				<span className="text-xs font-black leading-tight text-center truncate w-full uppercase">
					{rider.name.split(' ').pop()}
				</span>
				<div className="flex items-center gap-1">
					<span className="text-muted-foreground text-xs">{rider.number}</span>
					<Flag countryCode={rider.country_code} className="w-3.5 h-auto" />
				</div>
			</div>
		</button>
	)
}
