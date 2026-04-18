import Image from 'next/image'

import { logo } from '@/config/brand'

import { Spinner } from '../ui/spinner'

export function Splash() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<Image
				alt={logo.alt}
				height={logo.height}
				width={logo.width}
				priority
				sizes={logo.widthContainer}
				src={logo.src}
				className="w-48 opacity-90 sm:w-64"
			/>

			<Spinner className="size-8 opacity-50" />
		</div>
	)
}
