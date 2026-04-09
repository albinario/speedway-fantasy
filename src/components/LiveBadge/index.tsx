import { FrostedPill } from '@/components/FrostedPill'

export function LiveBadge() {
	return (
		<FrostedPill className="text-red-400">
			<span className="relative inline-flex size-1.5">
				<span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75 [animation-duration:1s]" />
				<span className="relative inline-flex size-1.5 rounded-full bg-red-400" />
			</span>
			<span className="text-base leading-none">Live</span>
		</FrostedPill>
	)
}
