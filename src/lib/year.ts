import { getYears } from '@/data/year'
import { getParamValue, paramKeys, paramValues } from '@/lib/params'

export async function getYearValues(searchParams: Promise<{ year?: string }>) {
	const years = await getYears()

	const latestYear = years?.[0]?.value
	const yearParam = await getParamValue(searchParams, paramKeys.year)

	const activeYear =
		yearParam === paramValues.all
			? paramValues.all
			: Number(yearParam) || latestYear || new Date().getFullYear()

	return { activeYear, years }
}

export type TYearValues = Awaited<ReturnType<typeof getYearValues>>
