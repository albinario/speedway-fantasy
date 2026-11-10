'use client'

import { useTransition } from 'react'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

import { LoadingFallback } from '@/components/LoadingFallback'
import { SegmentedControl } from '@/components/SegmentedControl'
import type { TUsersForm } from '@/components/UsersStandings'

type TFormToggle = {
	form: TUsersForm
	children: React.ReactNode
}

export function FormToggle({ form, children }: TFormToggle) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()
	const t = useTranslations('Standings')

	function setForm(next: TUsersForm) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('form', next)
		startTransition(() => {
			router.push(`?${params.toString()}`)
		})
	}

	return (
		<>
			<SegmentedControl
				options={[
					{ value: 'total', label: t('formTotal') },
					{ value: 'last2', label: t('formLast2') },
					{ value: 'last4', label: t('formLast4') }
				]}
				value={form}
				onChange={setForm}
			/>

			{isPending ? <LoadingFallback /> : children}
		</>
	)
}
