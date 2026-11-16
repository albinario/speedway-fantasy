export type TPositionProgress = {
	byUser: Record<number, number[]>
	// Most GPs anyone has a position for — shared x-scale for the standings column
	rounds: number
}

// With ~90 players a shared 1..N scale flattens everyone near the top, so each
// line is scaled to its own range — padded to a minimum span so a single-place
// move doesn't look like a cliff.
export function positionRange(positions: number[], minSpan = 4) {
	let top = Math.min(...positions)
	let bottom = Math.max(...positions)
	const missing = minSpan - (bottom - top)
	if (missing > 0) {
		top = Math.max(1, top - Math.ceil(missing / 2))
		bottom = top + minSpan
	}
	return { top, bottom }
}

// A user who joined mid-season has a shorter array, so positions are
// right-aligned: the last entry is always the latest GP.
// Returns fractions 0..1 (x: left→right, y: 0 = range top / best position).
export function positionPoints(positions: number[], rounds: number) {
	const { top, bottom } = positionRange(positions)
	const offset = rounds - positions.length

	return positions.map((pos, i) => ({
		pos,
		x: rounds <= 1 ? 0.5 : (i + offset) / (rounds - 1),
		y: (pos - top) / (bottom - top)
	}))
}
