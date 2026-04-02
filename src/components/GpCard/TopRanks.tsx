import { getGpTopRider, getGpTopUser } from '@/app/gps/data'
import { InfoBox } from '@/components/InfoBox'
import { RiderInfo } from '@/components/RiderInfo'
import { UsersName } from '@/components/UserName'

type TTopRanks = {
	gpId: number
}

export async function TopRanks({ gpId }: TTopRanks) {
	const [topRider, topUser] = await Promise.all([
		getGpTopRider(gpId),
		getGpTopUser(gpId)
	])

	if (!topRider && !topUser) return null
	if (topUser && topUser.points === 0) return null

	return (
		<InfoBox className="flex flex-col gap-4">
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
				<div className="flex justify-end">
					<RiderInfo
						name={topRider.name}
						countryCode={topRider.country_code}
						number={topRider.number}
						riderId={topRider.id}
					/>
				</div>
			)}
		</InfoBox>
	)
}
