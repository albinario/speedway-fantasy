import { MedalIcon as MedalIconLucide } from 'lucide-react'

import type { getRiderStats } from '@/app/riders/[id]/data'
import { Flag } from '@/components/Flag'
import { RiderImage } from '@/components/RiderImage'
import { getMedalColorHex } from '@/lib/medals'

type TRiderHero = {
	countryCode: string | null | undefined
	name: string | null | undefined
	number: number | null | undefined
	riderId: number
	stats: Awaited<ReturnType<typeof getRiderStats>>
}

function Stat({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="flex flex-col items-center gap-0.5">
			<span className="text-lg leading-none font-black">{value}</span>
			<span className="text-muted-foreground text-xs">{label}</span>
		</div>
	)
}

function MedalStat({ type, count }: { type: number; count: number }) {
	const color = getMedalColorHex(type)
	return (
		<div className="flex flex-col items-center gap-0.5">
			<div className="flex items-center gap-1">
				<MedalIconLucide className="size-4" stroke={color} />
				<span className="text-lg leading-none font-black">{count}</span>
			</div>
			<span className="text-muted-foreground text-xs">
				{type === 1 ? 'Gold' : type === 2 ? 'Silver' : 'Bronze'}
			</span>
		</div>
	)
}

function Divider() {
	return (
		<div className="bg-foreground/10 hidden h-8 w-px self-center sm:block" />
	)
}

export function RiderHero({
	countryCode,
	name,
	number,
	riderId,
	stats
}: TRiderHero) {
	const points = Number(stats?.points ?? 0)
	const gps = Number(stats?.gps ?? 0)
	const heats = Number(stats?.heats ?? 0)
	const avgPts = gps > 0 ? Math.round((points / gps) * 10) / 10 : 0
	const timesPicked = Number(stats?.times_picked ?? 0)
	const avgPickedPerGp = gps > 0 ? Math.round((timesPicked / gps) * 10) / 10 : 0
	const medals = {
		gold: Number(stats?.gold ?? 0),
		silver: Number(stats?.silver ?? 0),
		bronze: Number(stats?.bronze ?? 0)
	}

	return (
		<div className="bg-card ring-foreground/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-xl p-4 ring-1">
			<div className="flex items-center gap-2">
				<RiderImage className="size-14" name={name} riderId={riderId} />
				<Flag countryCode={countryCode} />
				<span className="text-muted-foreground text-2xl leading-none font-black">
					{number}
				</span>
			</div>

			<Divider />

			<div className="flex gap-6">
				<Stat label="Points" value={points} />
				<Stat label="GPs" value={gps} />
				<Stat label="Heats" value={heats} />
				<Stat label="Avg / GP" value={avgPts} />
			</div>

			<Divider />

			<div className="flex gap-6">
				<MedalStat type={1} count={medals.gold} />
				<MedalStat type={2} count={medals.silver} />
				<MedalStat type={3} count={medals.bronze} />
			</div>

			<Divider />

			<div className="flex gap-6">
				<Stat label="Times picked" value={timesPicked} />
				<Stat label="Avg picks / GP" value={avgPickedPerGp} />
			</div>
		</div>
	)
}
