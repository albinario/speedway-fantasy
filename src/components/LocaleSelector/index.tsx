'use client'

import { useOptimistic, useTransition } from 'react'

import { useLocale, useTranslations } from 'next-intl'

import { Flag } from '@/components/Flag'
import { SegmentedControl } from '@/components/SegmentedControl'
import { setLocale } from '@/i18n/actions'
import type { TLocale } from '@/i18n/config'

export function LocaleSelector() {
	const t = useTranslations('LocaleSelector')
	const locale = useLocale()
	const [optimisticLocale, setOptimisticLocale] = useOptimistic(locale)
	const [, startTransition] = useTransition()

	function handleChange(next: TLocale) {
		startTransition(async () => {
			setOptimisticLocale(next)
			await setLocale(next)
		})
	}

	return (
		<div role="group" aria-label={t('label')}>
			<SegmentedControl
				onChange={handleChange}
				options={[
					{ value: 'sv', label: <Flag countryCode="SE" /> },
					{ value: 'en', label: <Flag countryCode="GB" /> }
				]}
				value={optimisticLocale}
			/>
		</div>
	)
}
