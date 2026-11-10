import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

import { getViewer } from '@/lib/auth/get-viewer'

import { defaultLocale, isLocale, localeCookie, type TLocale } from './config'

// First supported language in the browser's Accept-Language list, by preference
function fromAcceptLanguage(header: string | null): TLocale | undefined {
	return header
		?.split(',')
		.map((part) => {
			const [tag, q] = part.trim().split(';q=')
			return { lang: tag.split('-')[0].toLowerCase(), q: q ? Number(q) : 1 }
		})
		.sort((a, b) => b.q - a.q)
		.find(({ lang }) => isLocale(lang))?.lang as TLocale | undefined
}

// cookie → saved user preference → browser language → default
async function resolveLocale(): Promise<TLocale> {
	const cookie = (await cookies()).get(localeCookie)?.value
	if (isLocale(cookie)) return cookie

	const saved = (await getViewer().catch(() => null))?.db?.locale
	if (isLocale(saved)) return saved

	return (
		fromAcceptLanguage((await headers()).get('accept-language')) ??
		defaultLocale
	)
}

export default getRequestConfig(async () => {
	const locale = await resolveLocale()

	return {
		locale,
		messages: (await import(`./messages/${locale}`)).default
	}
})
