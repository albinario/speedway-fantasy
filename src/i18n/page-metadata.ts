import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import type { TMessages } from './messages/en'

type TPages = TMessages['Pages']

export type TPage = keyof TPages

// Use as `export const generateMetadata = () => getPageMetadata('standings')`
export async function getPageMetadata(page: TPage): Promise<Metadata> {
	const t = await getTranslations('Pages')

	return {
		title: t(`${page}.title`),
		description: t(`${page}.description`)
	}
}
