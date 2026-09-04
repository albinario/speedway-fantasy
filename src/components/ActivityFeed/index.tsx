import { Flag } from '@/components/Flag'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'
import { cn } from '@/lib/utils'

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
	offset?: number
}

export async function ActivityFeed({
	gpId,
	limit = 5,
	offset = 0
}: TActivityFeed) {
	const [entries, viewer] = await Promise.all([
		getActivityFeed(gpId, limit, offset),
		getViewer()
	])
	const viewerId = viewer?.db?.id

	if (!entries.length) return null

	return (
		<div className="flex flex-col">
			{entries.map((entry, i) => {
				const isLast = i === entries.length - 1
				const isCreated = entry.action === ActivityAction.PickCreated

				return (
					<div
						key={entry.id}
						className="grid grid-cols-[auto_1fr_auto] gap-x-3"
					>
						{/* Timeline */}
						<div className="flex flex-col items-center">
							<div
								className={cn(
									'w-px flex-1 bg-white/20',
									i === 0 && 'opacity-0'
								)}
							/>

							<div
								className={cn(
									'z-10 size-2 shrink-0 rounded-full',
									isCreated ? 'bg-green-400' : 'bg-yellow-400'
								)}
							/>

							<div
								className={cn('w-px flex-1 bg-white/20', isLast && 'opacity-0')}
							/>
						</div>

						{/* Content */}
						<div className="min-w-0 py-2">
							<UserName
								className="opacity-90"
								firstName={entry.first_name}
								lastName={entry.last_name}
								isViewer={entry.user_id === viewerId}
								userId={entry.user_id}
							/>
							<div className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
								{!gpId && (
									<Flag widthClass="w-3.5" countryCode={entry.country_code} />
								)}

								<span className="truncate text-xs">
									{entry.city_name} · {ActivityActionLabel[entry.action]}
								</span>
							</div>
						</div>

						<time className="text-muted-foreground shrink-0 self-center text-xs tabular-nums">
							{new Date(entry.created_at).toLocaleString('sv-SE', {
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								timeZone: 'Europe/Stockholm'
							})}
						</time>
					</div>
				)
			})}
		</div>
	)
}
