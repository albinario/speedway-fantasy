import { getYears } from '@/data/year'
import { getParamValue, paramKeys, paramValues } from '@/lib/params'

export async function getYearValues(
	searchParams: Promise<{ year?: string }>,
	defaultYear?: number | null
) {
	const years = await getYears()

	const latestYear = defaultYear ?? years?.[0]?.value
	const yearParam = await getParamValue(searchParams, paramKeys.year)

	const activeYear =
		yearParam === paramValues.all
			? paramValues.all
			: Number(yearParam) || latestYear || new Date().getFullYear()

	return { activeYear, latestYear, years }
}

export type TYearValues = Awaited<ReturnType<typeof getYearValues>>
