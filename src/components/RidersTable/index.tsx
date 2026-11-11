'use client'

import { useTranslations } from 'next-intl'

import { FlagNumber } from '@/components/FlagNumber'
import { MedalIcon } from '@/components/MedalIcon'
import { PosBadge } from '@/components/PosBadge'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { Card } from '@/components/ui/card'
import { DataTable, type TColumnDef } from '@/components/ui/data-table'

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
	hidePicked?: boolean
}

type TLabels = { points: string; heats: string; gps: string; picked: string }

function buildColumns({
	showGps,
	hidePicked,
	labels
}: Omit<TRidersTable, 'data'> & {
	showGps: boolean
	labels: TLabels
}): TColumnDef<TRiderRow>[] {
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
								<FlagNumber
									countryCode={countryCode}
									number={number}
									size="xs"
								/>

								{medals && medals.length > 0 && (
									<div className="flex items-center gap-0.5 pl-1 sm:gap-1 sm:pl-2">
										{medals.map((medal, i) => (
											<MedalIcon key={i} type={medal} />
										))}
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
			header: () => labels.points,
			accessorKey: 'points',
			cell: ({ getValue }) => (
				<span className="text-lg">{getValue<number>()}</span>
			),
			meta: { className: 'text-center' }
		},
		{
			id: 'heats',
			header: () => labels.heats,
			accessorKey: 'heats',
			cell: ({ getValue }: { getValue: () => unknown }) => getValue() as number,
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		},
		...(showGps
			? [
					{
						id: 'gps',
						header: () => labels.gps,
						accessorKey: 'gps',
						cell: ({ getValue }: { getValue: () => unknown }) =>
							getValue() as number,
						meta: { className: 'hidden px-1 text-center sm:table-cell' }
					} satisfies TColumnDef<TRiderRow>
				]
			: []),
		...(!hidePicked
			? [
					{
						id: 'timesPicked',
						header: () => labels.picked,
						accessorKey: 'timesPicked',
						cell: ({ getValue }: { getValue: () => unknown }) =>
							getValue() as number,
						meta: { className: 'hidden px-1 text-center sm:table-cell' }
					} satisfies TColumnDef<TRiderRow>
				]
			: [])
	]
}

export function RidersTable({ data, hidePicked }: TRidersTable) {
	const t = useTranslations('Common')
	const showGps = data.some((r) => r.gps != null)
	const columns = buildColumns({
		showGps,
		hidePicked,
		labels: {
			points: t('points'),
			heats: t('heats'),
			gps: t('gps'),
			picked: t('picked')
		}
	})

	return (
		<Card>
			<DataTable columns={columns} data={data} />
		</Card>
	)
}
