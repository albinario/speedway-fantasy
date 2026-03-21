export const paramKeys = {
	year: 'year'
} as const
export type TParamKeys = (typeof paramKeys)[keyof typeof paramKeys]

export const paramValues = {
	all: 'all'
} as const
export type TParamValues = (typeof paramValues)[keyof typeof paramValues]

export const getParamValue = async (
	searchParams: Promise<Record<string, string | string[] | undefined>>,
	key: TParamKeys
): Promise<string | undefined> => {
	const params = await searchParams
	const value = params[key]

	if (Array.isArray(value)) return value[0]
	return value
}
