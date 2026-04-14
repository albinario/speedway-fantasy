import { colors } from '@/config/brand'

export function buildMedals({
	medal_1,
	medal_2,
	medal_3
}: {
	medal_1?: number | null
	medal_2?: number | null
	medal_3?: number | null
}): number[] {
	return [
		...(medal_1 ? Array<number>(medal_1).fill(1) : []),
		...(medal_2 ? Array<number>(medal_2).fill(2) : []),
		...(medal_3 ? Array<number>(medal_3).fill(3) : [])
	]
}

export function getMedalColorHex(type: number) {
	return type === 1 ? colors.gold : type === 2 ? colors.silver : colors.bronze
}

export function getMedalColorStr(position: number, prefix?: 'bg' | 'text') {
	if (position > 3) return null
	const color = position === 1 ? 'gold' : position === 2 ? 'silver' : 'bronze'
	return prefix ? `${prefix}-${color}` : color
}
