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
				if (pos !== index) return null

				return <PosBadge pos={pos} prevPos={prev_pos} />
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
			<DataTable columns={makeColumns(viewerId)} data={data} />
		</Card>
	)
}
