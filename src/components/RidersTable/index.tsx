'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { FlagNumber } from '@/components/FlagNumber'
import { MedalCounts } from '@/components/MedalCounts'
import { MedalIcon } from '@/components/MedalIcon'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'

import { PosBadge } from '../UsersStandings/PosBadge'

export type TRiderRow = {
	riderId: number
	name: string | null | undefined
	countryCode: string | null | undefined
	number: number | null | undefined
	medals?: number[]
	points: number
	heats?: number
	gps?: number
	timesPicked?: number
	pickedByViewer?: boolean
	pos: number | null
}

type TRidersTable = {
	data: TRiderRow[]
	condensedMedals?: boolean
	hidePicked?: boolean
}

function buildColumns({
	condensedMedals,
	showGps,
	hidePicked
}: Omit<TRidersTable, 'data'> & { showGps: boolean }): ColumnDef<TRiderRow>[] {
	return [
		{
			id: 'pos',
			header: '',
			enableSorting: false,
			cell: ({ row }) =>
				row.original.pos != null ? (
					<PosBadge
						pos={row.original.pos}
						tiedPos={row.original.pos !== row.index + 1}
					/>
				) : null
		},
		{
			id: 'name',
			header: '',
			enableSorting: false,
			cell: ({ row }) => {
				const { name, countryCode, number, medals, riderId, pickedByViewer } =
					row.original

				return (
					<div className="flex items-center gap-2">
						<RiderImage
							className="size-10 shrink-0"
							name={name}
							riderId={riderId}
						/>

						<div>
							{name && (
								<RiderName
									highlight={pickedByViewer}
									name={name}
									riderId={riderId}
								/>
							)}

							<div className="mt-1 flex w-fit items-center gap-1">
								<FlagNumber countryCode={countryCode} number={number} />

								{medals && medals.length > 0 && (
									<div className="flex items-center gap-0.5 pl-1 sm:gap-1 sm:pl-2">
										{condensedMedals ? (
											<MedalCounts
												medal_1={medals.filter((m) => m === 1).length}
												medal_2={medals.filter((m) => m === 2).length}
												medal_3={medals.filter((m) => m === 3).length}
											/>
										) : (
											medals.map((medal, i) => <MedalIcon key={i} type={medal} />)
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				)
			}
		},
		{
			id: 'points',
			header: () => 'Points',
			accessorKey: 'points',
			cell: ({ getValue }) => (
				<span className="text-lg">{getValue<number>()}</span>
			),
			meta: { className: 'text-center' }
		},
		{
			id: 'heats',
			header: () => 'Heats',
			accessorKey: 'heats',
			cell: ({ getValue }: { getValue: () => unknown }) => getValue() as number,
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		},
		...(showGps
			? [
					{
						id: 'gps',
						header: () => "GP's",
						accessorKey: 'gps',
						cell: ({ getValue }: { getValue: () => unknown }) =>
							getValue() as number,
						meta: { className: 'hidden px-1 text-center sm:table-cell' }
					} satisfies ColumnDef<TRiderRow>
				]
			: []),
		...(!hidePicked
			? [
					{
						id: 'timesPicked',
						header: () => 'Picked',
						accessorKey: 'timesPicked',
						cell: ({ getValue }: { getValue: () => unknown }) =>
							getValue() as number,
						meta: { className: 'hidden px-1 text-center sm:table-cell' }
					} satisfies ColumnDef<TRiderRow>
				]
			: [])
	]
}

export function RidersTable({
	data,
	condensedMedals,
	hidePicked
}: TRidersTable) {
	const showGps = data.some((r) => r.gps != null)
	const columns = buildColumns({ condensedMedals, showGps, hidePicked })

	return (
		<Card>
			<DataTable
				columns={columns}
				data={data}
				getRowClassName={(row) =>
					row.pickedByViewer ? 'bg-orange-400/5' : undefined
				}
			/>
		</Card>
	)
}
