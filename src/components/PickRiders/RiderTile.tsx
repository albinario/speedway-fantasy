'use client'

import { FlagNumber } from '@/components/FlagNumber'
import { MedalIcon } from '@/components/MedalIcon'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { getMedalColorStr } from '@/lib/medals'
import { cn } from '@/lib/utils'

import type { TPickRider } from './Sheet'

type TRiderTile = {
	rider: TPickRider
	className?: string
	linked?: boolean
	hideFirstName?: boolean
	isSelected?: boolean
	isDimmed?: boolean
	onClick?: () => void
	medal?: number | null
	points?: number | null
}

export function RiderTile({
	rider,
	className,
	linked = false,
	hideFirstName = false,
	isSelected = false,
	isDimmed = false,
	onClick,
	medal,
	points
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
					<RiderName
						className="text-center leading-tight"
						name={nameToRender}
						riderId={rider.id}
					/>
				) : (
					<span className="w-full text-center text-xs leading-tight">
						{nameToRender}
					</span>
				)}

				<FlagNumber countryCode={rider.country_code} number={rider.number} />

				{(medal != null || points != null) && (
					<div className="mt-auto flex items-center gap-1">
						{medal != null && <MedalIcon type={medal} />}

						{points != null && (
							<span className="text-sm font-black">
								{points}{' '}
								<span className="text-muted-foreground text-sm">pts</span>
							</span>
						)}
					</div>
				)}
			</div>
		</Comp>
	)
}
