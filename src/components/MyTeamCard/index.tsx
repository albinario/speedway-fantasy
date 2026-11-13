import { getTranslations } from 'next-intl/server'

import { Coins } from 'lucide-react'

import { RiderTile } from '@/components/RiderTile'
import { RiderTilesEmpty } from '@/components/RiderTilesEmpty'
import { SectionTitle } from '@/components/SectionHeader'
import { Card, CardContent, CardFooter, CardGlow } from '@/components/ui/card'
import { accent } from '@/i18n/rich'
import { BUDGET_COINS } from '@/lib/budget'

import { getTradeData } from './data'
import { TradeButton } from './TradeButton'

type TMyTeamCard = {
	gpId: number
	gpStartDate: Date | string
	viewerId: number
}

/**
 * The viewer's team and the one Trade button (2027 budget system).
 * Renders nothing until the next GP has a field in gps_riders. Coins are the
 * locked price paid; riders out of the field are dimmed.
 */
export async function MyTeamCard({ gpId, gpStartDate, viewerId }: TMyTeamCard) {
	const [trade, t] = await Promise.all([
		getTradeData(gpId, gpStartDate, viewerId),
		getTranslations('MyTeam')
	])

	if (!trade.field.length) return null

	return (
		<div>
			<SectionTitle>{t.rich('title', { accent })}</SectionTitle>

			<Card className="relative isolate">
				<CardGlow color="green" position="top" />

				<CardContent className="flex flex-col gap-3 pt-4">
					<div className="flex items-center gap-1.5 text-sm">
						<Coins className="size-4 text-yellow-400" />
						{t.rich('spent', {
							spent: trade.spent,
							budget: BUDGET_COINS,
							accent
						})}
					</div>

					<div className="grid grid-cols-3 gap-2">
						{trade.teamRiders.length > 0 ? (
							trade.teamRiders.map((rider) => (
								<RiderTile
									key={rider.id}
									rider={rider}
									coins={rider.coins}
									isDimmed={rider.isOut}
									linked
									hideFirstName
								/>
							))
						) : (
							<RiderTilesEmpty count={3} variant="red" />
						)}
					</div>
				</CardContent>

				<CardFooter className="flex-col gap-2">
					<TradeButton
						disabled={!trade.isWindowOpen}
						gpId={gpId}
						riders={trade.riders}
						initialPicks={trade.initialPicks}
					/>

					{!trade.isWindowOpen && (
						<p className="text-muted-foreground text-center text-xs">
							{t('windowClosed')}
						</p>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}
