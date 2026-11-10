import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'

export function LiveBadge() {
	const t = useTranslations('Common')

	return (
		<Badge variant="frosted" className="flex items-center gap-2 p-2">
			<span className="relative inline-flex size-3 items-center justify-center">
				<span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75 [animation-duration:1.5s]" />
				<span className="relative inline-flex size-2 rounded-full bg-red-400" />
			</span>
			<span className="text-base leading-none font-black">{t('live')}</span>
		</Badge>
	)
}
