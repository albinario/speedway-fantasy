import { MedalIcon as MedalIconLucide, StarIcon } from 'lucide-react'

import { PosBadge } from '@/components/UsersStandings/PosBadge'
import { getMedalColorHex } from '@/lib/medals'

type TStar = {
	type: number
	year: number
}

type TUserHero = {
	starRecords: TStar[]
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

function StarStat({ type, year }: { type: number; year: number }) {
	const color = getMedalColorHex(type)
	const label = type === 1 ? 'Winner' : type === 2 ? 'Second' : 'Third'
	return (
		<div className="flex flex-col items-center gap-0.5">
			<div className="flex items-center gap-1">
				<StarIcon className="size-4" fill={color} stroke={color} />
				<span className="text-lg leading-none font-black">{label}</span>
			</div>
			<span className="text-muted-foreground text-xs">{year}</span>
		</div>
	)
}

function Divider() {
	return (
		<div className="bg-foreground/10 hidden h-8 w-px self-center sm:block" />
	)
}

export function UserHero({ starRecords }: TUserHero) {
	// Mock values — replace with real data when ready
	const pos = 3
	const prevPos = 5
	const points = 47
	const gps = 8
	const totalGps = 12
	const heats = 23
	const avgPts = 5.9
	const bestResultPos = 1
	const bestResultCity = 'Warsaw'
	const pointsBehindLeader = 6
	const bestYear = { year: 2024, pos: 1 }
	const medals = { gold: 2, silver: 1, bronze: 3 }

	return (
		<div className="bg-card ring-foreground/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-xl p-4 ring-1">
			<div className="flex items-center gap-2">
				<PosBadge pos={pos} prevPos={prevPos} />
			</div>

			<Divider />

			<div className="flex gap-6">
				<Stat label="Points" value={points} />
				<MedalStat type={1} count={medals.gold} />
				<MedalStat type={2} count={medals.silver} />
				<MedalStat type={3} count={medals.bronze} />
			</div>

			<Divider />

			<div className="flex gap-6">
				<Stat label="GPs" value={`${gps}/${totalGps}`} />
				<Stat label="Heats" value={heats} />
				<Stat label="Avg / GP" value={avgPts} />
			</div>

			<Divider />

			<div className="flex gap-6">
				<Stat
					label="Best result"
					value={`#${bestResultPos} ${bestResultCity}`}
				/>
				<Stat label="Behind leader" value={`-${pointsBehindLeader}`} />
				<Stat label="Best year" value={`#${bestYear.pos} ${bestYear.year}`} />
			</div>

			{starRecords.length > 0 && (
				<>
					<Divider />

					<div className="flex gap-6">
						{starRecords.map(({ year, type }) => (
							<StarStat key={year} type={type} year={year} />
						))}
					</div>
				</>
			)}

		</div>
	)
}
