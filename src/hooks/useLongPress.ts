import { useRef } from 'react'

export function useLongPress(
	onLongPress: () => void,
	onTap: () => void,
	delay = 500
) {
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
	const fired = useRef(false)

	return {
		onPointerDown(e: React.PointerEvent) {
			if (e.pointerType === 'mouse') return
			fired.current = false
			timer.current = setTimeout(() => {
				fired.current = true
				onLongPress()
			}, delay)
		},
		onPointerUp() {
			clearTimeout(timer.current)
		},
		onPointerCancel() {
			clearTimeout(timer.current)
			fired.current = false
		},
		onClick() {
			if (fired.current) {
				fired.current = false
				return
			}
			onTap()
		}
	}
}
