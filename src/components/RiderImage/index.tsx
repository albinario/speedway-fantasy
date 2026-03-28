import { Image } from '@/components/Image'
import { cn } from '@/lib/utils'

type TRiderImage = {
	className?: string
	riderId: number
}

export function RiderImage({ className, riderId }: TRiderImage) {
	return (
		<Image
			className={cn('rounded-full object-cover', className)}
			fallbackSrc="/icon-alt-rider.png"
			height={400}
			width={400}
			src={`/riders/${riderId}.png`}
		/>
	)
}
