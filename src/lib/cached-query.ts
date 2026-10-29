import { unstable_cache } from 'next/cache'

import { dataFetch } from '@/lib/data-fetch'

type TCacheOptions = NonNullable<Parameters<typeof unstable_cache>[2]>
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- same constraint as unstable_cache
type TQuery = (...args: any[]) => Promise<unknown>

// unstable_cache + dataFetch, with the error handling outside the cache: a
// failed query throws past unstable_cache (so nothing is stored) and the
// fallback is returned for this request only. The query itself must throw,
// so don't wrap it in dataFetch.
export function cachedQuery<T extends TQuery, F>(
	query: T,
	keyParts: string[],
	{ fallback, ...options }: TCacheOptions & { fallback: F }
) {
	const cached = unstable_cache(query, keyParts, options)
	return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | F> =>
		dataFetch(
			() => cached(...args) as Promise<Awaited<ReturnType<T>>>,
			fallback
		)
}
