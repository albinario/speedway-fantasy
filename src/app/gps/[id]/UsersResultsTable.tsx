'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { FlagNumber } from '@/components/FlagNumber'
import { MedalIcon } from '@/components/MedalIcon'
import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { UserName } from '@/components/UserName'
import { getMedalColor } from '@/lib/medals'

import type { getGpUsersResults } from './data'

type TRow = Awaited<ReturnType<typeof getGpUsersResults>>[number]

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
		}
	},
	{
		id: 'name',
		header: '',
		cell: ({ row }) => {
			const {
				user_id,
				first_name,
				last_name,
				stars,
				pick_1_country,
				pick_1_number,
				pick_2_country,
				pick_2_number,
				pick_3_country,
				pick_3_number
			} = row.original

			const picks = [
				{ countryCode: pick_1_country, number: pick_1_number },
				{ countryCode: pick_2_country, number: pick_2_number },
				{ countryCode: pick_3_country, number: pick_3_number }
			].sort((a, b) => (a.number ?? 0) - (b.number ?? 0))

			return (
				<>
					<UserName
						userId={user_id}
						firstName={first_name}
						lastName={last_name}
						stars={stars}
					/>
					<div className="mt-1 flex items-center gap-2">
						{picks.map((pick, i) => (
							<FlagNumber
								key={i}
								countryCode={pick.countryCode}
								number={pick.number}
							/>
						))}
					</div>
				</>
			)
		}
	},
	{
		id: 'medals',
		header: '',
		enableSorting: false,
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
		meta: { className: 'text-center' }
	},
	{
		accessorKey: 'heats',
		header: 'Heats',
		meta: { className: 'hidden text-center sm:table-cell' }
	}
]

type TGpUsersResultsTable = {
	data: TRow[]
}

export function GpUsersResultsTable({ data }: TGpUsersResultsTable) {
	return (
		<Card className="bg-black p-0">
			<DataTable columns={columns} data={data} />
		</Card>
	)
}
