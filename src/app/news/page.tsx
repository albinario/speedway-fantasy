import type { Metadata } from 'next'
import Link from 'next/link'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { NewsFeed } from '@/components/NewsFeed'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'

import { metaData } from './constants'
import { getPublishedNewsCount } from './data'

export const metadata: Metadata = metaData

const LIMIT = 20

type TNewsPage = {
	searchParams: Promise<{ page?: string }>
}

export default async function NewsPage({ searchParams }: TNewsPage) {
	const { page: pageParam } = await searchParams
	const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

	const countResult = await getPublishedNewsCount()
	const total = Number(countResult?.count ?? 0)
	const totalPages = Math.max(1, Math.ceil(total / LIMIT))
	const clampedPage = Math.min(page, totalPages)
	const offset = (clampedPage - 1) * LIMIT

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-4">
			<PageHeader title={metaData.title} hideYearSelector />

			<NewsFeed limit={LIMIT} offset={offset} />

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-3">
					<Button
						asChild
						disabled={clampedPage <= 1}
						size="icon-lg"
						variant="outline"
					>
						<Link
							aria-label="Previous page"
							href={`/news?page=${clampedPage - 1}`}
						>
							<ChevronLeft />
						</Link>
					</Button>

					<span className="text-muted-foreground text-sm tabular-nums">
						{clampedPage} / {totalPages}
					</span>

					<Button
						asChild
						disabled={clampedPage >= totalPages}
						size="icon-lg"
						variant="outline"
					>
						<Link aria-label="Next page" href={`/news?page=${clampedPage + 1}`}>
							<ChevronRight />
						</Link>
					</Button>
				</div>
			)}
		</div>
	)
}
