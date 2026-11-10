import type { TLocale } from '@/i18n/config'
import type { TMessages } from '@/i18n/messages/en'

// Typed message keys and locale for useTranslations / getTranslations
declare module 'next-intl' {
	interface AppConfig {
		Locale: TLocale
		Messages: TMessages
	}
}
