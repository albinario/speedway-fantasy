import { getGpTopUsers } from '@/app/gps/data'
import { InfoBox } from '@/components/InfoBox'
import { MedalIcon } from '@/components/MedalIcon'
import { UserName } from '@/components/UserName'
import { getViewer } from '@/lib/auth/get-viewer'
import { getMedalColorStr } from '@/lib/medals'

type TTopPlayers = {
	gpId: number
}

export async function TopPlayers({ gpId }: TTopPlayers) {
	const [rows, viewer] = await Promise.all([
		getGpTopUsers(gpId, 3),
		getViewer()
	])
	const viewerId = viewer?.db?.id

	const validRows = rows.filter(
		(r): r is typeof r & { id: number } => r.id != null
	)
	if (!validRows.length || validRows[0].points === 0) return null

	return (
		<InfoBox className="flex flex-col gap-3">
			<div className="font-black uppercase">Top <span className="text-green-400">3</span> players</div>

			<div className="divide-border -mx-3 divide-y">
				{validRows.map((row, i) => {
					const pos = i + 1
					const isMedal = pos <= 3
					const medals = [
						...(row.medal_1 ? Array<number>(row.medal_1).fill(1) : []),
						...(row.medal_2 ? Array<number>(row.medal_2).fill(2) : []),
						...(row.medal_3 ? Array<number>(row.medal_3).fill(3) : [])
					]

					return (
						<div key={row.id!} className="flex items-center gap-3 px-3 py-2">
							<span
								className={`inline-flex size-5 shrink-0 items-center justify-center rounded text-xs ${isMedal ? `${getMedalColorStr(pos, 'bg')} text-black` : 'bg-gray-800'}`}
							>
								{pos}
							</span>
							<div className="min-w-0 flex-1">
								<UserName
									userId={row.id!}
									firstName={row.first_name}
									lastName={row.last_name}
									stars={row.stars}
									isViewer={row.id === viewerId}
								/>
							</div>
							{medals.length > 0 && (
								<div className="flex gap-1">
									{medals.map((m, i) => (
										<MedalIcon key={i} type={m} />
									))}
								</div>
							)}
							<span className={`text-lg ${getMedalColorStr(pos, 'text') ?? ''}`}>
								{row.points}
															</span>
						</div>
					)
				})}
			</div>
		</InfoBox>
	)
}
