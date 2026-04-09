import { getGpTopRider, getGpTopUser } from '@/app/gps/data'
import { InfoBox } from '@/components/InfoBox'
import { InfoBoxTitle } from '@/components/InfoBox/Title'
import { RiderInfo } from '@/components/RiderInfo'
import { UserName } from '@/components/UserName'

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
		<InfoBox className="flex flex-col gap-3">
			<div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
				<InfoBoxTitle>Top ranks</InfoBoxTitle>

				{topUser?.id && (
					<div className="ml-auto flex items-baseline gap-1.5">
						<UserName
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
						className="text-xs"
						countryCode={topRider.country_code}
						name={topRider.name}
						number={topRider.number}
						riderId={topRider.id}
					/>
				</div>
			)}
		</InfoBox>
	)
}
