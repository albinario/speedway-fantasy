'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { Flag } from '@/components/Flag'
import { MedalIcon } from '@/components/MedalIcon'
import { RiderImage } from '@/components/RiderImage'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { getMedalColor } from '@/lib/medals'

import type { getRidersStandings } from './data'

type TRow = Awaited<ReturnType<typeof getRidersStandings>>[number]

const columns: ColumnDef<TRow>[] = [
	{
		id: 'pos',
		header: '',
		cell: ({ row }) => {
			const pos = row.index + 1
			const isMedal = pos <= 3

			return (
				<span
					className="inline-flex size-7 items-center justify-center rounded-md bg-gray-800"
					style={
						isMedal
							? { backgroundColor: getMedalColor(pos), color: 'black' }
							: undefined
					}
				>
					{pos}
				</span>
			)
		},
		enableSorting: false
	},
	{
		id: 'avatar',
		header: '',
		enableSorting: false,
		cell: ({ row }) => (
			<RiderImage className="size-12" riderId={row.original.rider_id} />
		)
	},
	{
		accessorKey: 'name',
		header: 'Name',
		enableSorting: false,
		cell: ({ row }) => {
			const { name, country_code, number, medals } = row.original

			return (
				<>
					<div className="text-xs font-black uppercase">{name}</div>

					<div className="mt-1 flex w-fit items-center gap-1">
						<Flag countryCode={country_code} className="w-3.5" />
						<span className="text-muted-foreground text-xs">{number}</span>

						{medals?.length > 0 && (
							<div className="flex items-center gap-1 pl-2">
								{medals.map((medal, i) => (
									<MedalIcon key={i} type={medal} />
								))}
							</div>
						)}
					</div>
				</>
			)
		}
	},
	{
		accessorKey: 'total_points',
		header: () => 'Points',
		cell: ({ getValue }) => getValue<number>(),
		meta: { className: 'text-center' }
	},
	{
		accessorKey: 'heats',
		header: () => 'Heats',
		cell: ({ getValue }) => getValue<number>(),
		meta: { className: 'hidden text-center sm:table-cell' }
	},
	{
		accessorKey: 'gps',
		header: () => "GP's",
		cell: ({ getValue }) => getValue<number>(),
		meta: { className: 'hidden text-center sm:table-cell' }
	},
	{
		accessorKey: 'times_picked',
		header: () => 'Picked',
		cell: ({ getValue }) => getValue<number>(),
		meta: { className: 'hidden text-center sm:table-cell' }
	}
]

type TRidersStandingsTable = {
	data: TRow[]
}

export function RidersStandingsTable({ data }: TRidersStandingsTable) {
	return (
		<Card className="bg-black p-0 font-black">
			<DataTable columns={columns} data={data} />
		</Card>
	)
}
