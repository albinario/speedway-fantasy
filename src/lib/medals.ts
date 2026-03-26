import { colors } from '@/config/brand'

export function getMedalColor(type: number) {
	return type === 1 ? colors.gold : type === 2 ? colors.silver : colors.bronze
}
