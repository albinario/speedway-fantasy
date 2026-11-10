export const locales = ['en', 'sv'] as const

export type TLocale = (typeof locales)[number]

export const defaultLocale: TLocale = 'en'

export const localeCookie = 'NEXT_LOCALE'

export const localeCookieOptions = {
	path: '/',
	maxAge: 60 * 60 * 24 * 365,
	sameSite: 'lax'
} as const

export function isLocale(value: unknown): value is TLocale {
	return locales.includes(value as TLocale)
}
