import { createTranslator } from 'next-intl'

import { colors } from '@/config/brand'
import { defaultLocale, isLocale, type TLocale } from '@/i18n/config'
import en from '@/i18n/messages/en'
import sv from '@/i18n/messages/sv'

const messages = { en, sv }

export function getEmailTranslator(locale: string | null) {
	const resolved: TLocale = isLocale(locale) ? locale : defaultLocale
	return createTranslator({
		locale: resolved,
		messages: messages[resolved],
		namespace: 'Email'
	})
}

export function emailHtml(body: string, footer: string) {
	return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111;">${body}<p style="margin-top:32px;font-size:12px;color:#999;">${footer}</p></body></html>`
}

export const ctaStyle = `display:inline-block;background:${colors.brandRed};color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;`
