'use client'

import { ErrorFallback } from '@/components/ErrorFallback'
import type { TErrorProps } from '@/types/error'

import { fetchFailed, metaData } from './constants'

export default function Error(props: TErrorProps) {
	return (
		<ErrorFallback
			{...props}
			label={metaData.title}
			fetchFailed={fetchFailed}
		/>
	)
}
