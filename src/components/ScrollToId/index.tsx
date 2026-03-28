'use client'

import { useEffect } from 'react'

type TScrollToId = {
	id: string
}

export function ScrollToId({ id }: TScrollToId) {
	useEffect(() => {
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: 'smooth', block: 'end' })
	}, [id])

	return null
}
