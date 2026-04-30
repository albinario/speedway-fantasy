import { Badge } from './ui/badge'

export function TestBadge() {
	return (
		<Badge
			className="fixed top-3 left-3 z-[60] bg-yellow-400 text-xs font-bold text-black"
			variant="default"
		>
			TEST
		</Badge>
	)
}
