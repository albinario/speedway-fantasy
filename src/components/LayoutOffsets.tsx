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
		const observed = new Set<Element>()

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const target = targets.find((t) => entry.target.matches(t.selector))
				if (!target) continue
				root.style.setProperty(
					target.variable,
					`${entry.target.getBoundingClientRect().height}px`
				)
			}
		})

		function observeTargets() {
			for (const { selector } of targets) {
				const el = document.querySelector(selector)
				if (el && !observed.has(el)) {
					observed.add(el)
					resizeObserver.observe(el)
				}
			}
		}

		observeTargets()

		// The footer streams in behind a Suspense boundary, so it may not exist
		// yet on mount: keep watching until every target has been found
		const mutationObserver = new MutationObserver(() => {
			observeTargets()
			if (observed.size === targets.length) mutationObserver.disconnect()
		})
		if (observed.size < targets.length) {
			mutationObserver.observe(document.body, {
				childList: true,
				subtree: true
			})
		}

		return () => {
			resizeObserver.disconnect()
			mutationObserver.disconnect()
		}
	}, [])

	return null
}
