export const paramKeys = {
	year: 'year'
} as const

type TParamValues = (typeof paramKeys)[keyof typeof paramKeys]

export const getParamValue = async (
	searchParams: Promise<Record<string, string | string[] | undefined>>,
	key: TParamValues
): Promise<string | undefined> => {
	const params = await searchParams
	const value = params[key]

	if (Array.isArray(value)) return value[0]
	return value
}
