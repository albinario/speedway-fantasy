'use client'

import { useEffect } from 'react'

const targets = [
	{ selector: '[data-slot="app-header"]', variable: '--header-h' },
	{ selector: '[data-slot="app-footer"]', variable: '--footer-h' }
]

// Exposes the sticky header/footer heights as CSS variables so other sticky
// elements can sit flush against them
export function LayoutOffsets() {
	useEffect(() => {
		const root = document.documentElement

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const target = targets.find((t) => entry.target.matches(t.selector))
				if (!target) continue
				root.style.setProperty(
					target.variable,
					`${entry.target.getBoundingClientRect().height}px`
				)
			}
		})

		for (const { selector } of targets) {
			const el = document.querySelector(selector)
			if (el) observer.observe(el)
		}

		return () => observer.disconnect()
	}, [])

	return null
}
