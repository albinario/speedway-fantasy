import { InfoBox } from '@/components/InfoBox'

import { getViewerGpResult } from './data'

type TGpViewerResult = {
	gpId: number
	label?: string
	viewerId: number
}

export async function ViewerGpResult({
	gpId,
	label = 'My result',
	viewerId
}: TGpViewerResult) {
	const result = await getViewerGpResult(gpId, viewerId)

	if (!result) return null

	return (
		<InfoBox>
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-sm">{label}</span>
				<div className="flex items-baseline gap-2">
					{result.pos && (
						<span className="text-2xl leading-none">#{result.pos}</span>
					)}
					<span className="text-muted-foreground text-sm">
						{result.points} pts
					</span>
				</div>
			</div>
		</InfoBox>
	)
}
