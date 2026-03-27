import type { Metadata } from 'next'

import { metaData, noData } from './constants'
import { __DATA_FUNCTION__ } from './data'

export const metadata: Metadata = metaData

export default async function __PAGE_TITLE__Page() {
	const __DATA_VARIABLE__ = await __DATA_FUNCTION__()

	return (
		<>
			<h1>{metaData.title}</h1>

			{__DATA_VARIABLE__?.length <= 0 ? (
				<p>{noData}</p>
			) : (
				<pre>
					<code>{JSON.stringify(__DATA_VARIABLE__, null, 2)}</code>
				</pre>
			)}
		</>
	)
}
