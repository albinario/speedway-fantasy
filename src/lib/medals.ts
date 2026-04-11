import { colors } from '@/config/brand'

export function getMedalColorHex(type: number) {
	return type === 1 ? colors.gold : type === 2 ? colors.silver : colors.bronze
}

export function getMedalColorStr(position: number, prefix?: 'bg' | 'text') {
	if (position > 3) return null
	const color = position === 1 ? 'gold' : position === 2 ? 'silver' : 'bronze'
	return prefix ? `${prefix}-${color}` : color
}
