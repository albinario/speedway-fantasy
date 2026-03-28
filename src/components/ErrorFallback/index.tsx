'use client'


import type { TErrorProps } from '@/types/error'

type TErrorFallback = TErrorProps & {
	label: string
	fetchFailed: string
}

export function ErrorFallback({
	error,
	label = 'Error',
	fetchFailed = 'Something went wrong',
}: TErrorFallback) {
	return (
		<>
			<h1>{label}</h1>
			<p>{error?.message ?? fetchFailed}</p>
		</>
	)
}
