import { Flag } from '@/components/Flag'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'

import { getActivityFeed } from './data'

export const ActivityAction = {
	PickCreated: 1,
	PickUpdated: 2
} as const

export const ActivityActionLabel: Record<number, string> = {
	[ActivityAction.PickCreated]: 'Picked',
	[ActivityAction.PickUpdated]: 'Updated'
}

type TActivityFeed = {
	gpId?: number
	limit?: number
}

export async function ActivityFeed({ gpId, limit = 5 }: TActivityFeed) {
	const [entries, viewer] = await Promise.all([
		getActivityFeed(gpId, limit),
		getViewer()
	])
	const viewerId = viewer?.db?.id

	if (!entries.length) return null


	return (
		<div className="mt-4 overflow-hidden">
			{entries.map((entry) => (
				<div
					key={entry.id}
					className="border-border grid grid-cols-[1fr_auto] items-end gap-x-4 border-t py-2"
				>
					<div className="min-w-0">
						<UserName
							className="opacity-90"
							firstName={entry.first_name}
							lastName={entry.last_name}
							userId={entry.user_id}
							isViewer={entry.user_id === viewerId}
						/>
						<div className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
							<Flag
								className="h-auto w-3.5 shrink-0"
								countryCode={entry.country_code}
							/>
							<span className="truncate text-xs">
								{ActivityActionLabel[entry.action]} · {entry.round}{' '}
								{entry.city_name}
							</span>
						</div>
					</div>

					<time className="text-muted-foreground shrink-0 text-xs tabular-nums">
						{new Date(entry.created_at).toLocaleString('sv-SE', {
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</time>
				</div>
			))}
		</div>
	)
}
