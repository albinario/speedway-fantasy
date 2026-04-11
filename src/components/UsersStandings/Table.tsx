'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { MedalIcon } from '@/components/MedalIcon'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { UserName } from '@/components/UserName'
import { getMedalColorStr } from '@/lib/medals'

import type { getUsersStandings } from './data'

type TRow = Awaited<ReturnType<typeof getUsersStandings>>[number]

function makeColumns(viewerId?: number): ColumnDef<TRow>[] {
	return [
		{
			id: 'pos',
			header: '',
			enableSorting: false,
			cell: ({ row }) => {
				const { pos, prev_pos } = row.original

				if (pos !== row.index + 1) return null

				const isMedal = pos != null && pos <= 3
				const moved = pos != null && prev_pos != null ? pos - prev_pos : null

				return (
					<div className="flex items-center gap-1">
						<span
							className={`inline-flex size-7 items-center justify-center rounded-md ${isMedal ? `${getMedalColorStr(pos, 'bg')} text-black` : 'bg-gray-800'}`}
						>
							{pos}
						</span>

						{moved !== null && moved < 0 && (
							<ArrowUp className="size-4 text-green-400" />
						)}
						{moved !== null && moved > 0 && (
							<ArrowDown className="size-4 text-red-500" />
						)}
					</div>
				)
			}
		},
		{
			accessorKey: 'first_name',
			header: '',
			enableSorting: false,
			cell: ({ row }) => (
				<UserName
					firstName={row.original.first_name}
					lastName={row.original.last_name}
					stars={row.original.stars}
					userId={row.original.user_id}
					isViewer={row.original.user_id === viewerId}
				/>
			)
		},
		{
			accessorKey: 'points',
			header: 'Points',
			cell: ({ getValue }) => (
				<span className="text-lg">{getValue<number>()}</span>
			),
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
}

type TUsersStandingsTable = {
	data: TRow[]
	viewerId?: number
}

export function UsersStandingsTable({ data, viewerId }: TUsersStandingsTable) {
	return (
		<Card className="bg-black p-0">
			<DataTable columns={makeColumns(viewerId)} data={data} />
		</Card>
	)
}
