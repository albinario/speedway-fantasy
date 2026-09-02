'use client'

import Link from 'next/link'

import type { ColumnDef } from '@tanstack/react-table'

import { FlagNumber } from '@/components/FlagNumber'
import { MedalIcon } from '@/components/MedalIcon'
import { PosBadge } from '@/components/PosBadge'
import { SectionTitle } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { UserName } from '@/components/UserName'
import { sortedPicks } from '@/lib/picks'

import type { getGpUsersResults } from './data'

type TRow = Awaited<ReturnType<typeof getGpUsersResults>>[number]

function makeColumns(
	viewerId?: number,
	firstOccurrenceByRider = new Map<number, number>(),
	isBefore = false
): ColumnDef<TRow>[] {
	return [
		...(!isBefore
			? [
					{
						id: 'pos',
						header: '',
						meta: { className: 'pr-0' },
						cell: ({ row }: { row: { original: TRow; index: number } }) => {
							const { pos } = row.original
							return (
								<PosBadge pos={pos} size="lg" tiedPos={pos !== row.index + 1} />
							)
						}
					} as ColumnDef<TRow>
				]
			: []),
		{
			id: 'name',
			header: '',
			cell: ({ row }) => {
				const { user_id, first_name, last_name, stars } = row.original

				const picks = isBefore ? [] : sortedPicks(row.original)

				return (
					<div className="flex items-center gap-2">
						<div>
							<UserName
								userId={user_id}
								firstName={first_name}
								lastName={last_name}
								stars={stars}
								isViewer={user_id === viewerId}
							/>
							<div className="mt-1 flex items-center gap-2">
								{picks.map((pick, i) => (
									<Link
										key={i}
										href={`/riders/${pick.riderId}`}
										className={
											pick.riderId == null ? 'pointer-events-none' : ''
										}
									>
										<FlagNumber
											countryCode={pick.countryCode}
											number={pick.number}
											highlight={
												pick.number != null &&
												firstOccurrenceByRider.get(pick.number) === row.index
											}
											size="xs"
										/>
									</Link>
								))}
							</div>
						</div>
					</div>
				)
			}
		},
		{
			id: 'medals',
			header: '',
			enableSorting: false,
			meta: { className: 'hidden px-0 sm:table-cell' },
			cell: ({ row }) => {
				const { medal_1, medal_2, medal_3 } = row.original
				const medals = [
					...(medal_1 ? Array<number>(medal_1).fill(1) : []),
					...(medal_2 ? Array<number>(medal_2).fill(2) : []),
					...(medal_3 ? Array<number>(medal_3).fill(3) : [])
				]
				if (!medals.length) return null
				return (
					<div className="flex justify-center gap-1">
						{medals.map((m, i) => (
							<MedalIcon key={i} type={m} />
						))}
					</div>
				)
			}
		},
		{
			accessorKey: 'points',
			header: 'Points',
			cell: ({ getValue }) => (
				<span className="text-lg">{getValue<number>()}</span>
			),
			meta: { className: 'px-1 text-center' }
		},
		{
			accessorKey: 'heats',
			header: 'Heats',
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		},
		{
			accessorKey: 'season_points',
			header: 'Total',
			meta: { className: 'px-1 text-center' }
		}
	]
}

type TGpUsersResultsTable = {
	data: TRow[]
	isBefore?: boolean
	viewerId?: number
}

export function GpUsersResultsTable({
	data,
	viewerId,
	isBefore
}: TGpUsersResultsTable) {
	const firstOccurrenceByRider = new Map<number, number>()
	data.forEach((row, index) => {
		for (const pick of sortedPicks(row)) {
			if (pick.number != null && !firstOccurrenceByRider.has(pick.number)) {
				firstOccurrenceByRider.set(pick.number, index)
			}
		}
	})

	return (
		<div>
			<SectionTitle>Players</SectionTitle>

			<Card>
				<DataTable
					columns={makeColumns(viewerId, firstOccurrenceByRider, isBefore)}
					data={data}
					getRowClassName={(row) =>
						row.user_id === viewerId ? 'bg-orange-400/5' : undefined
					}
				/>
			</Card>
		</div>
	)
}
