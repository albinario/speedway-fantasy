'use client'

import { useEffect, useRef } from 'react'

type TRiderAvatar = {
	id: number
}

const FALLBACK = '/icon-alt-rider.png'

function setFallback(img: HTMLImageElement) {
	img.onerror = null
	img.src = FALLBACK
}

export function RiderAvatar({ id }: TRiderAvatar) {
	const ref = useRef<HTMLImageElement>(null)

	useEffect(() => {
		const img = ref.current
		if (img && img.complete && img.naturalWidth === 0) {
			setFallback(img)
		}
	}, [])

	return (
		<img
			ref={ref}
			alt=""
			className="size-12 rounded-full object-cover"
			src={`/riders/${id}.png`}
			onError={(e) => setFallback(e.currentTarget)}
		/>
	)
}
