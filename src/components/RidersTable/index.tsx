'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { FlagNumber } from '@/components/FlagNumber'
import { MedalIcon } from '@/components/MedalIcon'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'

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
}

type TRidersTable = {
	data: TRiderRow[]
	condensedMedals?: boolean
}

function buildColumns({
	condensedMedals
}: Omit<TRidersTable, 'data'>): ColumnDef<TRiderRow>[] {
	return [
		{
			id: 'pos',
			header: '',
			enableSorting: false,
			cell: ({ row }) => {
				return (
					<span className="inline-flex size-7 items-center justify-center rounded-md bg-gray-800">
						{row.index + 1}
					</span>
				)
			}
		},
		{
			id: 'avatar',
			header: '',
			enableSorting: false,
			cell: ({ row }) => (
				<RiderImage className="size-10" riderId={row.original.riderId} />
			)
		},
		{
			id: 'name',
			header: '',
			enableSorting: false,
			cell: ({ row }) => {
				const { name, countryCode, number, medals, riderId } = row.original

				return (
					<>
						{name && <RiderName name={name} riderId={riderId} />}

						<div className="mt-1 flex w-fit items-center gap-1">
							<FlagNumber countryCode={countryCode} number={number} />

							{medals && medals.length > 0 && (
								<div className="flex items-center gap-0.5 pl-1 sm:gap-1 sm:pl-2">
									{condensedMedals
										? ([1, 2, 3] as const).map((type) => {
												const count = medals.filter((m) => m === type).length
												if (!count) return null
												return (
													<span
														key={type}
														className="text-muted-foreground inline-flex items-center gap-0.5 text-xs"
													>
														{count}
														<MedalIcon type={type} />
													</span>
												)
											})
										: medals.map((medal, i) => (
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
			meta: { className: 'hidden text-center sm:table-cell' }
		},
		{
			id: 'gps',
			header: () => "GP's",
			accessorKey: 'gps',
			cell: ({ getValue }: { getValue: () => unknown }) => getValue() as number,
			meta: { className: 'hidden text-center sm:table-cell' }
		},
		{
			id: 'timesPicked',
			header: () => 'Picked',
			accessorKey: 'timesPicked',
			cell: ({ getValue }: { getValue: () => unknown }) => getValue() as number,
			meta: { className: 'hidden text-center sm:table-cell' }
		}
	]
}

export function RidersTable({ data, condensedMedals }: TRidersTable) {
	const columns = buildColumns({ condensedMedals })

	return (
		<Card className="bg-black p-0">
			<DataTable columns={columns} data={data} />
		</Card>
	)
}
