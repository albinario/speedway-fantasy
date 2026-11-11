'use client'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ChevronDown, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { TYears } from '@/data/year'
import { paramKeys, paramValues, type TParamValues } from '@/lib/params'

type TYearSelectorProps = {
	defaultYear?: number | null
	years: TYears
}

export function YearSelector({ defaultYear, years }: TYearSelectorProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const t = useTranslations('YearSelector')

	const latestYear = defaultYear ?? years[0]?.value
	const yearParam = searchParams.get(paramKeys.year)
	const activeYear: number | TParamValues =
		yearParam === paramValues.all
			? paramValues.all
			: Number(yearParam) || latestYear || new Date().getFullYear()

	const showClearButton = Boolean(
		activeYear === paramValues.all || (latestYear && activeYear !== latestYear)
	)

	const clearYear = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete(paramKeys.year)
		const queryString = params.toString()
		router.push(queryString ? `${pathname}?${queryString}` : pathname)
	}

	const updateYear = (year: number | TParamValues) => {
		const params = new URLSearchParams(searchParams.toString())

		if (year === paramValues.all) {
			params.set(paramKeys.year, paramValues.all)
		} else {
			params.set(paramKeys.year, String(year))
		}

		router.push(`${pathname}?${params.toString()}`)
	}

	return (
		<DropdownMenu>
			<div className="flex items-center gap-2">
				<DropdownMenuTrigger asChild>
					<Button
						className="group flex items-center gap-2"
						size="lg"
						variant="outline"
					>
						<span>
							{activeYear === paramValues.all ? t('allTime') : activeYear}
						</span>

						<ChevronDown
							aria-hidden
							className="size-4 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180"
						/>
					</Button>
				</DropdownMenuTrigger>

				{showClearButton && (
					<Button onClick={clearYear} size="lg" variant="outline">
						<X aria-hidden className="size-4 text-white" /> {t('reset')}
					</Button>
				)}
			</div>

			<DropdownMenuContent align="end" className="w-fit min-w-0 px-2">
				<DropdownMenuGroup>
					<DropdownMenuLabel>{t('years')}</DropdownMenuLabel>

					{years.map((year) => (
						<DropdownMenuItem
							key={year.value}
							onClick={() => updateYear(year.value)}
						>
							{year.value}
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => updateYear(paramValues.all)}>
						{t('allTime')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
