import { Users } from 'lucide-react'

import { getPicksCount } from './data'

type TRegisteredPlayers = {
	gpId: number
}

export async function RegisteredPlayers({ gpId }: TRegisteredPlayers) {
	const { count } = await getPicksCount(gpId)

	return (
		<div className="flex items-center gap-1 text-sm font-black uppercase">
			<Users className="size-4 text-green-400" />
			<span className="text-green-400">{count}</span>
			<span className="opacity-80">Registered players</span>
		</div>
	)
}
