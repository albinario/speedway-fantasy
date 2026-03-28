'use client'

import { useState } from 'react'

import NextImage from 'next/image'

type TImage = {
	alt?: string
	className?: string
	fallbackSrc?: string
	height: number
	priority?: boolean
	width: number
	src: string
}

export function Image({
	alt = '',
	className,
	fallbackSrc,
	height,
	priority,
	src,
	width
}: TImage) {
	const [imgSrc, setImgSrc] = useState(src)

	return (
		<NextImage
			alt={alt}
			className={className}
			height={height}
			width={width}
			onError={() => {
				if (fallbackSrc && imgSrc !== fallbackSrc) {
					setImgSrc(fallbackSrc)
				}
			}}
			priority={priority}
			src={imgSrc}
		/>
	)
}
