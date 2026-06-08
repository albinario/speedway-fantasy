'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { MedalIcon } from '@/components/MedalIcon'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { UserName } from '@/components/UserName'

import type { getUsersStandings } from './data'
import { PosBadge } from './PosBadge'

type TRow = Awaited<ReturnType<typeof getUsersStandings>>[number]

function makeColumns(viewerId?: number): ColumnDef<TRow>[] {
	return [
		{
			id: 'pos',
			header: '',
			enableSorting: false,
			meta: { className: 'pr-0' },
			cell: ({ row }) => {
				const { pos, prev_pos } = row.original
				const index = row.index + 1

				if (pos == null) return <PosBadge pos={index} />

				return (
					<PosBadge
						pos={pos}
						prevPos={prev_pos}
						tiedPos={pos !== index}
						size="lg"
					/>
				)
			}
		},
		{
			accessorKey: 'first_name',
			header: '',
			enableSorting: false,
			meta: { className: 'pl-0' },
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<div>
						<UserName
							firstName={row.original.first_name}
							lastName={row.original.last_name}
							stars={row.original.stars}
							userId={row.original.user_id}
							isViewer={row.original.user_id === viewerId}
						/>
						{/* <div className="mt-1">
							<MedalCounts
								medal_1={Number(row.original.medal_1)}
								medal_2={Number(row.original.medal_2)}
								medal_3={Number(row.original.medal_3)}
							/>
						</div> */}
					</div>
				</div>
			)
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
			accessorKey: 'medal_1',
			header: () => <MedalIcon type={1} />,
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		},
		{
			accessorKey: 'medal_2',
			header: () => <MedalIcon type={2} />,
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		},
		{
			accessorKey: 'medal_3',
			header: () => <MedalIcon type={3} />,
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		},
		{
			accessorKey: 'heats',
			header: 'Heats',
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		},
		{
			accessorKey: 'gps',
			header: 'GPs',
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		}
	]
}

type TUsersStandingsTable = {
	data: TRow[]
	viewerId?: number
}

export function UsersStandingsTable({ data, viewerId }: TUsersStandingsTable) {
	return (
		<Card>
			<DataTable
				columns={makeColumns(viewerId)}
				data={data}
				getRowClassName={(row) =>
					row.user_id === viewerId ? 'bg-orange-400/5' : undefined
				}
			/>
		</Card>
	)
}
