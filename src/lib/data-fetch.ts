export async function dataFetch<T, F>(
	query: () => Promise<T>,
	fallback: F,
) {
	try {
		return await query()
	} catch (error) {
		console.error(error)
		return fallback
	}
}
