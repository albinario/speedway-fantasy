'use client'

import { useEffect } from 'react'

export function HeaderHeightObserver() {
	useEffect(() => {
		const el = document.getElementById('site-header')
		if (!el) return

		const observer = new ResizeObserver(([entry]) => {
			document.documentElement.style.setProperty(
				'--header-h',
				`${entry.contentRect.height}px`
			)
		})

		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return null
}
