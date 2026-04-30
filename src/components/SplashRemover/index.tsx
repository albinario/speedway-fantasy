'use client'

import { useEffect } from 'react'

export function SplashRemover() {
	useEffect(() => {
		document.getElementById('app-splash')?.remove()
	}, [])

	return null
}
