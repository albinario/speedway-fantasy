import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { ChevronRight } from 'lucide-react'

type TSectionTitle = {
	children: React.ReactNode
	href?: string
	linkLabel?: string
}

export function SectionTitle({ children, href, linkLabel }: TSectionTitle) {
	const t = useTranslations('Common')

	return (
		<div className="flex items-center justify-between p-3 uppercase">
			<span className="text-xl font-black">{children}</span>

			{href && (
				<Link
					href={href}
					className="text-brand-red flex items-center gap-1 text-sm"
				>
					{linkLabel ?? t('viewAll')} <ChevronRight className="size-4" />
				</Link>
			)}
		</div>
	)
}
