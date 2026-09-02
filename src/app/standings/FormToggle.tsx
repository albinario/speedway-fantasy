'use client'

import { useTransition } from 'react'

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
					{ value: 'total', label: 'Total' },
					{ value: 'last2', label: 'Last 2' },
					{ value: 'last4', label: 'Last 4' }
				]}
				value={form}
				onChange={setForm}
			/>

			{isPending ? <LoadingFallback /> : children}
		</>
	)
}
