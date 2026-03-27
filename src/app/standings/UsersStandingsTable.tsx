'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { MedalIcon } from '@/components/MedalIcon'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { UsersName } from '@/components/UserName'
import { getMedalColor } from '@/lib/medals'

import type { getUsersStandings } from './data'

type TRow = Awaited<ReturnType<typeof getUsersStandings>>[number]

const columns: ColumnDef<TRow>[] = [
	{
		id: 'pos',
		header: '',
		enableSorting: false,
		cell: ({ row, table }) => {
			const rows = table.getRowModel().rows
			let posToRender = 1
			for (let i = 1; i <= row.index; i++) {
				const a = rows[i - 1].original
				const b = rows[i].original
				const tied =
					a.pos === b.pos &&
					a.points === b.points &&
					a.medal_1 === b.medal_1 &&
					a.medal_2 === b.medal_2 &&
					a.medal_3 === b.medal_3 &&
					a.heats === b.heats
				if (!tied) posToRender = i + 1
			}

			const isMedal = posToRender <= 3
			const { pos, prev_pos } = row.original
			const moved = pos != null && prev_pos != null ? pos - prev_pos : null

			return (
				<div className="flex items-center gap-1">
					<span
						className="inline-flex size-7 items-center justify-center rounded-md bg-gray-800"
						style={
							isMedal
								? {
										backgroundColor: getMedalColor(posToRender),
										color: 'black'
									}
								: undefined
						}
					>
						{posToRender}
					</span>

					{moved !== null && moved < 0 && (
						<ArrowUp className="size-4 text-green-500" />
					)}
					{moved !== null && moved > 0 && (
						<ArrowDown className="size-4 text-red-500" />
					)}
				</div>
			)
		}
	},
	// {
	// 	id: 'avatar',
	// 	header: '',
	// 	enableSorting: false,
	// 	cell: ({ row }) => (
	// 		<img
	// 			alt=""
	// 			className="size-10 object-cover"
	// 			src={`/users/${row.original.user_id}.jpg`}
	// 			onError={(e) => {
	// 				const img = e.currentTarget
	// 				img.onerror = null
	// 				img.src = '/icon-alt.png'
	// 			}}
	// 		/>
	// 	)
	// },
	{
		accessorKey: 'first_name',
		header: 'Name',
		enableSorting: false,
		cell: ({ row }) => (
			<UsersName
				firstName={row.original.first_name}
				lastName={row.original.last_name}
				stars={row.original.stars}
			/>
		)
	},
	{
		accessorKey: 'points',
		header: 'Points',
		meta: { className: 'text-center' }
	},
	{
		accessorKey: 'medal_1',
		header: () => <MedalIcon type={1} />,
		meta: { className: 'hidden text-center sm:table-cell' }
	},
	{
		accessorKey: 'medal_2',
		header: () => <MedalIcon type={2} />,
		meta: { className: 'hidden text-center sm:table-cell' }
	},
	{
		accessorKey: 'medal_3',
		header: () => <MedalIcon type={3} />,
		meta: { className: 'hidden text-center sm:table-cell' }
	},
	{
		accessorKey: 'heats',
		header: 'Heats',
		meta: { className: 'hidden text-center sm:table-cell' }
	},
	{
		accessorKey: 'gps',
		header: 'GPs',
		meta: { className: 'hidden text-center sm:table-cell' }
	}
]

type TUsersStandingsTable = {
	data: TRow[]
}

export function UsersStandingsTable({ data }: TUsersStandingsTable) {
	return (
		<Card className="bg-black p-0 font-black">
			<DataTable columns={columns} data={data} />
		</Card>
	)
}
