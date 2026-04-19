import type { Metadata } from 'next'

import { Card } from '@/components/ui/card'
import { UserAvatar } from '@/components/UserAvatar'
import { UserName } from '@/components/UserName'

import { metaData } from './constants'
import { getUsers } from './data'

export const metadata: Metadata = metaData

export default async function UsersPage() {
	const users = await getUsers()

	const validUsers = users.filter(
		(u): u is typeof u & { id: number } => u.id != null
	)
	if (!validUsers.length) return null

	return (
		<Card className="divide-border divide-y overflow-hidden py-0">
			{validUsers.map((user) => (
				<div
					key={user.id}
					className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3"
				>
					<div className="flex min-w-0 items-center gap-2">
						<UserAvatar
							firstName={user.first_name}
							lastName={user.last_name}
							className="size-10 shrink-0 text-xs"
						/>
						<UserName
							firstName={user.first_name}
							lastName={user.last_name}
							userId={user.id ?? 0}
							stars={user.stars}
						/>
					</div>

					<span className="text-muted-foreground text-sm tabular-nums">
						{user.gps} GPs
					</span>
				</div>
			))}
		</Card>
	)
}
