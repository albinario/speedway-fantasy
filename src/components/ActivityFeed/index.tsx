import { Flag } from '@/components/Flag'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'

import { InfoBox } from '../InfoBox'
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
		<>
			{entries.map((entry, i) => {
				const isLast = i === entries.length - 1
				const isViewer = entry.user_id === viewerId
				const isCreated = entry.action === ActivityAction.PickCreated

				return (
					<div
						key={entry.id}
						className="grid grid-cols-[auto_1fr_auto] gap-x-3 py-2"
					>
						{/* Timeline */}
						<div className="flex flex-col items-center">
							<div
								className={`bg-border w-px flex-1 ${i === 0 ? 'opacity-0' : ''}`}
							/>
							<div
								className={`z-10 size-2 shrink-0 rounded-full ${isCreated ? 'bg-green-400' : 'bg-yellow-400'}`}
							/>
							<div
								className={`bg-border w-px flex-1 ${isLast ? 'opacity-0' : ''}`}
							/>
						</div>

						{/* Content */}
						<div className="min-w-0">
							<UserName
								className="opacity-90"
								firstName={entry.first_name}
								lastName={entry.last_name}
								userId={entry.user_id}
								isViewer={isViewer}
							/>
							<div className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
								{!gpId && (
									<Flag
										className="h-auto w-3.5 shrink-0"
										countryCode={entry.country_code}
									/>
								)}
								<span className="truncate text-xs">
									{entry.city_name} ·{' '}
									<span
										className={isCreated ? 'text-green-400' : 'text-yellow-400'}
									>
										{ActivityActionLabel[entry.action]}
									</span>
								</span>
							</div>
						</div>

						<time className="text-muted-foreground shrink-0 self-end text-xs tabular-nums">
							{new Date(entry.created_at).toLocaleString('sv-SE', {
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</time>
					</div>
				)
			})}
		</>
	)
}
