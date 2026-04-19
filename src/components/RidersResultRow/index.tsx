import { FlagNumber } from '@/components/FlagNumber'
import { MedalIcon } from '@/components/MedalIcon'
import { RiderImage } from '@/components/RiderImage'
import { RiderName } from '@/components/RiderName'
import { PosBadge } from '@/components/UsersStandings/PosBadge'

type TRidersResultRow = {
	riderId: number
	name: string | null | undefined
	countryCode: string | null | undefined
	number: number | null | undefined
	medal: number | null | undefined
	points: number
	pos: number | null
	isPicked?: boolean
}

export function RidersResultRow({
	riderId,
	name,
	countryCode,
	number,
	medal,
	points,
	pos,
	isPicked = false
}: TRidersResultRow) {
	return (
		<div
			className={`flex items-center gap-2 px-3 py-2 ${isPicked ? 'bg-orange-400/5' : ''}`}
		>
			<PosBadge pos={pos} />

			<RiderImage className="size-8 shrink-0" name={name} riderId={riderId} />

			<div className="min-w-0 flex-1">
				<RiderName name={name} riderId={riderId} highlight={isPicked} />

				<FlagNumber countryCode={countryCode} number={number} size="xs" />
			</div>

			<div className="flex items-center gap-2">
				{medal != null && <MedalIcon type={medal} />}
				<span className="text-lg">{points}</span>
			</div>
		</div>
	)
}
