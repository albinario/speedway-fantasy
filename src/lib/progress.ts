export function getProgressColor(progress: number) {
	if (progress <= 30) return { textColor: 'text-red-400', bgColor: 'bg-red-400' }
	if (progress <= 89) return { textColor: 'text-yellow-400', bgColor: 'bg-yellow-400' }
	return { textColor: 'text-green-400', bgColor: 'bg-green-400' }
}
