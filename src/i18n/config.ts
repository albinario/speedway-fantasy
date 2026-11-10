import type { TMessages } from './messages/en'

export const locales = ['en', 'sv'] as const

export type TLocale = (typeof locales)[number]

export const defaultLocale: TLocale = 'en'

// Locale passed to Intl / toLocale*String for dates and numbers
export const intlLocales: Record<TLocale, string> = {
	en: 'en-GB',
	sv: 'sv-SE'
}

export const localeCookie = 'NEXT_LOCALE'

export const localeCookieOptions = {
	path: '/',
	maxAge: 60 * 60 * 24 * 365,
	sameSite: 'lax'
} as const

// Namespaces sent to the browser for client components; everything else is
// only used on the server. `bun run i18n:check` verifies this list.
export const clientNamespaces = [
	'Comments',
	'Common',
	'Countdown',
	'Errors',
	'GpCard',
	'LocaleSelector',
	'Nav',
	'Onboarding',
	'PickRiders',
	'Season2027',
	'Standings',
	'YearSelector'
] as const satisfies (keyof TMessages)[]

export function isLocale(value: unknown): value is TLocale {
	return locales.includes(value as TLocale)
}
