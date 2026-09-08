'use client'

import { useLayoutEffect, useRef } from 'react'

import { PosBadge } from '@/components/PosBadge'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import { UserName } from '@/components/UserName'

import type { getGpUsersWithStandings } from './data'

type TRow = Awaited<ReturnType<typeof getGpUsersWithStandings>>[number]

type Props = {
	data: TRow[]
	viewerId?: number
}

export function GpUsersStandingsTable({ data, viewerId }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const viewerRowRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		const container = containerRef.current
		const row = viewerRowRef.current
		if (!container || !row) return

		container.scrollTop =
			row.offsetTop - container.clientHeight / 2 + row.clientHeight / 2
	}, [])

	if (!data.length) return null

	return (
		<div>
			<SectionTitle>Players</SectionTitle>
			<Card>
				<div
					ref={containerRef}
					className="max-h-[420px] divide-y overflow-y-auto"
				>
					{data.map((row) => {
						const isViewer = row.user_id === viewerId

						return (
							<div
								key={row.user_id}
								ref={isViewer ? viewerRowRef : undefined}
								className="flex items-center gap-3 px-3 py-2"
							>
								<PosBadge pos={row.pos} />
								<UserName
									userId={row.user_id}
									firstName={row.first_name}
									lastName={row.last_name}
									stars={row.stars}
									isViewer={isViewer}
									className="flex-1 truncate"
								/>
								<span className="text-muted-foreground text-sm tabular-nums">
									{row.season_points ?? 0}
								</span>
							</div>
						)
					})}
				</div>
			</Card>
		</div>
	)
}
