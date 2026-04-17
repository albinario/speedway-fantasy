import Image from 'next/image'

import { logo } from '@/config/brand'

export function Splash() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<Image
				alt={logo.alt}
				height={logo.height}
				width={logo.width}
				priority
				sizes={logo.widthContainer}
				src={logo.src}
				className="w-48 sm:w-64 opacity-90"
			/>
		</div>
	)
}
