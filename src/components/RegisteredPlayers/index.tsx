import { getTranslations } from 'next-intl/server'

import { Users } from 'lucide-react'

import { getPicksCount } from './data'

type TRegisteredPlayers = {
	gpId: number
}

export async function RegisteredPlayers({ gpId }: TRegisteredPlayers) {
	const [{ count }, t] = await Promise.all([
		getPicksCount(gpId),
		getTranslations('GpCard')
	])

	return (
		<div className="flex items-center gap-1 text-sm font-black uppercase">
			<Users className="size-4 text-green-400" />
			<span className="text-foreground/80">
				{t.rich('registeredPlayers', {
					count: Number(count),
					num: (chunks) => <span className="text-green-400">{chunks}</span>
				})}
			</span>
		</div>
	)
}
