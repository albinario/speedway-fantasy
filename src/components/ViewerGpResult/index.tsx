import { InfoBox } from '@/components/InfoBox'

import { getViewerGpResult } from './data'

type TGpViewerResult = {
	asCard?: boolean
	gpId: number
	viewerId: number
}

export async function ViewerGpResult({
	asCard = false,
	gpId,
	viewerId
}: TGpViewerResult) {
	const result = await getViewerGpResult(gpId, viewerId)

	if (!result) return null

	return (
		<InfoBox asCard={asCard}>
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-sm">My result</span>
				<div className="flex items-baseline gap-2">
					{result.pos && (
						<span className="text-2xl leading-none font-black">
							#{result.pos}
						</span>
					)}
					<span className="text-muted-foreground text-xs">
						{result.points} pts
					</span>
				</div>
			</div>
		</InfoBox>
	)
}
