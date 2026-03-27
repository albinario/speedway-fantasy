'use client'

import { ErrorFallback } from '@/components/ErrorFallback'

import { fetchFailed, metaData } from './constants'

import type { TErrorProps } from '@/types/error'

export default function Error(props: TErrorProps) {
	return (
		<ErrorFallback
			{...props}
			label={metaData.title}
			fetchFailed={fetchFailed}
		/>
	)
}
