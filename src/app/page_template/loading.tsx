import { LoadingFallback } from '@/components/LoadingFallback'

import { metaData } from './constants'

export default function Loading() {
	return <LoadingFallback title={metaData.title} />
}
