import type { Metadata } from 'next'

import { locale } from '@/config/time-zone'
import type { ColumnMeta } from '@/types/column-meta'

import { metaData, noData } from './constants'
import { getUsers } from './data'

export const metadata: Metadata = metaData

export default async function UsersPage() {
	const users = await getUsers()

	const columns: ColumnMeta<(typeof users)[number]>[] =
		users.length > 0
			? Object.keys(users[0]).map((key) => ({
					key: key as keyof (typeof users)[number],
					label: key,
					...(key === 'date_created' && {
						format: (val: unknown) =>
							val
								? new Date(val as string | number | Date).toLocaleDateString(
										locale,
										{ dateStyle: 'medium' }
									)
								: ''
					})
				}))
			: []

	return (
		<>
			<h1>{metaData.title}</h1>

			{users.length <= 0 ? (
				<p>{noData}</p>
			) : (
				<table>
					<thead>
						<tr>
							{columns.map((col) => (
								<th key={String(col.key)}>{col.label}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								{columns.map((col) => {
									const raw = user[col.key]
									const value = col.format ? col.format(raw) : String(raw ?? '')
									return <td key={String(col.key)}>{value}</td>
								})}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	)
}
