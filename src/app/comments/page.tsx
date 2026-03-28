import type { Metadata } from 'next'


import { metaData, noData } from './constants'
import { getComments } from './data'

export const metadata: Metadata = metaData

export default async function CommentsPage() {
	const comments = await getComments()

	return (
		<>
			<h1>{metaData.title}</h1>

			{comments.length <= 0 ? (
				<p>{noData}</p>
			) : (
				<pre>
					<code>{JSON.stringify(comments, null, 2)}</code>
				</pre>
			)}
		</>
	)
}
