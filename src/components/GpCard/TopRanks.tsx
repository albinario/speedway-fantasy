import { getGpTopRider, getGpTopUser } from '@/app/gps/data'
import { Flag } from '@/components/Flag'
import { InfoBox } from '@/components/InfoBox'
import { RiderImage } from '@/components/RiderImage'
import { UsersName } from '@/components/UserName'

type TTopRanks = {
	asCard?: boolean
	gpId: number
}

export async function TopRanks({ asCard = false, gpId }: TTopRanks) {
	const [topRider, topUser] = await Promise.all([
		getGpTopRider(gpId),
		getGpTopUser(gpId)
	])

	if (!topRider && !topUser) return null
	if (topUser && topUser.points === 0) return null

	return (
		<InfoBox asCard={asCard}>
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">Top ranks</span>
				{topUser?.id && (
					<div className="flex items-baseline gap-1.5">
						<UsersName
							firstName={topUser.first_name}
							lastName={topUser.last_name}
							stars={topUser.stars}
							userId={topUser.id}
						/>
						<span className="text-muted-foreground text-xs">
							{topUser.points} pts
						</span>
					</div>
				)}
			</div>

			{topRider && (
				<div className="flex items-center justify-end gap-2 text-sm">
					<RiderImage className="size-8" riderId={topRider.id} />
					<span className="uppercase">{topRider.name}</span>
					<Flag countryCode={topRider.country_code} />
				</div>
			)}
		</InfoBox>
	)
}
