import { getNextGp } from '@/app/gps/data'

import { getTradeData } from './data'
import { TradeButton } from './TradeButton'

type THeaderTradeButton = {
	viewerId: number
}

/** Quick access to the trade sheet from the header. Hidden while the transfer window is closed. */
export async function HeaderTradeButton({ viewerId }: THeaderTradeButton) {
	const nextGp = await getNextGp()
	if (!nextGp) return null

	const trade = await getTradeData(nextGp.id, nextGp.start_date, viewerId)
	if (!trade.isWindowOpen) return null

	return (
		<TradeButton
			compact
			gpId={nextGp.id}
			riders={trade.riders}
			initialPicks={trade.initialPicks}
		/>
	)
}
