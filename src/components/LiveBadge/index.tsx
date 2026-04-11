import { Badge } from '@/components/ui/badge'

export function LiveBadge() {
	return (
		<Badge variant="frosted" className="text-green-400">
			<span className="relative inline-flex size-1.5">
				<span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75 [animation-duration:1s]" />
				<span className="relative inline-flex size-1.5 rounded-full bg-red-400" />
			</span>
			<span className="text-base leading-none">Live</span>
		</Badge>
	)
}
