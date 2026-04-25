'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Flag } from '@/components/Flag'
import { SegmentedControl } from '@/components/SegmentedControl'

type TLang = 'sv' | 'en'

export function LangToggle({ lang }: { lang: TLang }) {
	const router = useRouter()
	const searchParams = useSearchParams()

	function setLang(next: TLang) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('lang', next)
		router.push(`?${params.toString()}`)
	}

	return (
		<SegmentedControl
			options={[
				{ value: 'sv', label: <Flag countryCode="SE" /> },
				{ value: 'en', label: <Flag countryCode="GB" /> }
			]}
			value={lang}
			onChange={setLang}
		/>
	)
}
