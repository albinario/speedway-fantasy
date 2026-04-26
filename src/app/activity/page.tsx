import type { Metadata } from 'next'
import Link from 'next/link'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { ActivityFeed } from '@/components/ActivityFeed'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { getActivityCount } from './data'

export const metadata: Metadata = { title: 'Activity' }

const LIMIT = 50

type TActivityPage = {
	searchParams: Promise<{ page?: string }>
}

export default async function ActivityPage({ searchParams }: TActivityPage) {
	const { page: pageParam } = await searchParams
	const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

	const countResult = await getActivityCount()
	const total = Number(countResult?.count ?? 0)
	const totalPages = Math.max(1, Math.ceil(total / LIMIT))
	const clampedPage = Math.min(page, totalPages)
	const offset = (clampedPage - 1) * LIMIT

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-4">
			<PageHeader title="Activity" hideYearSelector />

			<Card className="px-4 py-1">
				<ActivityFeed limit={LIMIT} offset={offset} />
			</Card>

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
							href={`/activity?page=${clampedPage - 1}`}
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
						<Link
							aria-label="Next page"
							href={`/activity?page=${clampedPage + 1}`}
						>
							<ChevronRight />
						</Link>
					</Button>
				</div>
			)}
		</div>
	)
}
