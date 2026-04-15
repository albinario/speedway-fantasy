'use client'

import { useState } from 'react'

import NextImage from 'next/image'

import { cn } from '@/lib/utils'

type TRiderImage = {
	className?: string
	name?: string | null
	riderId: number
}

export function RiderImage({ className, name, riderId }: TRiderImage) {
	const [error, setError] = useState(false)

	if (error && name) {
		const initials = name
			? name
					.split(' ')
					.slice(0, 2)
					.map((n) => n[0])
					.join('')
					.toUpperCase()
			: null

		return (
			<span
				className={cn(
					'inline-flex shrink-0 items-center justify-center rounded-full bg-white/10 font-bold',
					className
				)}
			>
				{initials}
			</span>
		)
	}

	return (
		<NextImage
			alt={name ?? ''}
			className={cn('shrink-0 rounded-full object-cover', className)}
			height={400}
			width={400}
			onError={() => setError(true)}
			src={`/riders/${riderId}.png`}
		/>
	)
}
