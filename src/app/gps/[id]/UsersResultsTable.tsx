'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { FlagNumber } from '@/components/FlagNumber'
import { MedalIcon } from '@/components/MedalIcon'
import { PosBadge } from '@/components/PosBadge'
import { Card } from '@/components/ui/card'
import { DataTable, type TColumnDef } from '@/components/ui/data-table'
import { UserName } from '@/components/UserName'
import { buildMedals } from '@/lib/medals'
import { sortedPicks } from '@/lib/picks'

import type { getGpUsersResults } from './data'

type TRow = Awaited<ReturnType<typeof getGpUsersResults>>[number]

type TLabels = { points: string; heats: string; total: string }

function makeColumns(
	labels: TLabels,
	viewerId?: number,
	firstOccurrenceByRider = new Map<number, number>(),
	isBefore = false
): TColumnDef<TRow>[] {
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
					} as TColumnDef<TRow>
				]
			: []),
		{
			id: 'name',
			header: '',
			cell: ({ row }) => {
				const { user_id, first_name, last_name, stars } = row.original

				const picks = isBefore ? [] : sortedPicks(row.original)
				const medals = buildMedals(row.original)

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
								{picks.map((pick, i) => {
									const flag = (
										<FlagNumber
											countryCode={pick.countryCode}
											number={pick.number}
											highlight={
												pick.number != null &&
												firstOccurrenceByRider.get(pick.number) === row.index
											}
											size="xs"
										/>
									)

									if (pick.riderId == null) {
										return <div key={i}>{flag}</div>
									}

									return (
										<Link key={i} href={`/riders/${pick.riderId}`}>
											{flag}
										</Link>
									)
								})}

								{medals.length > 0 && (
									<div className="hidden items-center gap-1 pl-2 sm:flex">
										{medals.map((m, i) => (
											<MedalIcon key={i} type={m} />
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
			accessorKey: 'points',
			header: labels.points,
			cell: ({ getValue }) => (
				<span className="text-lg">{getValue<number>()}</span>
			),
			meta: { className: 'px-1 text-center' }
		},
		{
			accessorKey: 'heats',
			header: labels.heats,
			meta: { className: 'hidden px-1 text-center sm:table-cell' }
		},
		{
			accessorKey: 'season_points',
			header: labels.total,
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
	const t = useTranslations('Common')

	const firstOccurrenceByRider = new Map<number, number>()
	data.forEach((row, index) => {
		for (const pick of sortedPicks(row)) {
			if (pick.number != null && !firstOccurrenceByRider.has(pick.number)) {
				firstOccurrenceByRider.set(pick.number, index)
			}
		}
	})

	return (
		<Card className="overflow-clip">
			<DataTable
				columns={makeColumns(
					{ points: t('points'), heats: t('heats'), total: t('total') },
					viewerId,
					firstOccurrenceByRider,
					isBefore
				)}
				data={data}
				getRowSticky={(row) => row.user_id === viewerId}
			/>
		</Card>
	)
}
