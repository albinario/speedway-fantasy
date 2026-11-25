import { getLocale, getTranslations } from 'next-intl/server'

import { Flame, ShieldOff, Star, UserRoundCheck } from 'lucide-react'

import { getUserStars } from '@/app/users/[id]/data'
import { intlLocales } from '@/i18n/config'
import { getMedalColorHex } from '@/lib/medals'

import { getUserStreak } from './data'

type TUserMeta = {
	userId: number
	createdAt: Date
}

const TROPHY_LABEL = { 1: 'winner', 2: 'second', 3: 'third' } as const

// Facts about the user that don't change with the selected season
export async function UserMeta({ userId, createdAt }: TUserMeta) {
	const [trophies, { streak, total: totalGps }, t, locale] = await Promise.all([
		getUserStars(userId),
		getUserStreak(userId),
		getTranslations('UserMeta'),
		getLocale()
	])

	const everyGp = totalGps > 0 && streak === totalGps
	const memberSince = new Date(createdAt).toLocaleDateString(
		intlLocales[locale],
		{ day: 'numeric', month: 'long', year: 'numeric' }
	)

	return (
		<div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-3 sm:px-0">
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-1.5 text-xs">
					<UserRoundCheck className="size-4 text-green-400" />
					<span className="text-muted-foreground">{t('memberSince')}</span>
					<span>{memberSince}</span>
				</div>

				{trophies.length > 0 ? (
					<ul className="flex flex-wrap gap-x-4 gap-y-2">
						{trophies.map(({ year, type }) => {
							const color = getMedalColorHex(type)
							const label = TROPHY_LABEL[type as keyof typeof TROPHY_LABEL]

							return (
								<li key={year} className="flex items-center gap-1.5">
									<Star className="size-4" fill={color} stroke={color} />
									<span className="flex flex-col leading-none">
										{label && (
											<span className="text-sm font-black">{t(label)}</span>
										)}
										<span className="text-muted-foreground text-xs">
											{year}
										</span>
									</span>
								</li>
							)
						})}
					</ul>
				) : (
					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<ShieldOff className="size-4 opacity-50" />
						<span>{t('emptyTrophies')}</span>
					</div>
				)}
			</div>

			{streak > 0 && (
				<div className="ml-auto flex flex-col items-end gap-1">
					<div className="flex items-center gap-1">
						<span className="text-base font-black">{streak}</span>
						<Flame size={17} className="text-brand-red" />
						<span className="text-muted-foreground text-xs tracking-wide uppercase">
							{t('gpStreak')}
						</span>
					</div>

					{/* Achievement for never having missed a GP */}
					{everyGp && (
						<span
							title={t('pickedInAllGps', { count: totalGps })}
							className="border-gold/40 bg-gold/10 text-gold relative overflow-hidden rounded-full border px-2 py-0.5 text-xs font-black tracking-wide uppercase"
						>
							{t('everyGp')}
							<span
								aria-hidden
								className="animate-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/25 to-transparent motion-reduce:hidden"
							/>
						</span>
					)}
				</div>
			)}
		</div>
	)
}
