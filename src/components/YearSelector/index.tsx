'use client'
import { useTransition } from 'react'

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
import { Spinner } from '@/components/ui/spinner'
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
	const [isPending, startTransition] = useTransition()

	const navigate = (url: string) => startTransition(() => router.push(url))

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
		navigate(queryString ? `${pathname}?${queryString}` : pathname)
	}

	const updateYear = (year: number | TParamValues) => {
		const params = new URLSearchParams(searchParams.toString())

		if (year === paramValues.all) {
			params.set(paramKeys.year, paramValues.all)
		} else {
			params.set(paramKeys.year, String(year))
		}

		navigate(`${pathname}?${params.toString()}`)
	}

	return (
		<DropdownMenu>
			{/* Reset sits left of the selector so the selector never moves */}
			<div className="flex items-center gap-2">
				{showClearButton && (
					<Button
						disabled={isPending}
						onClick={clearYear}
						size="lg"
						variant="outline"
					>
						<X aria-hidden className="size-4 text-white" /> {t('reset')}
					</Button>
				)}

				<DropdownMenuTrigger asChild>
					<Button
						aria-busy={isPending}
						className="group flex items-center gap-2"
						size="lg"
						variant="outline"
					>
						<span>
							{activeYear === paramValues.all ? t('allTime') : activeYear}
						</span>

						{isPending ? (
							<Spinner className="size-4" />
						) : (
							<ChevronDown
								aria-hidden
								className="size-4 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180"
							/>
						)}
					</Button>
				</DropdownMenuTrigger>
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
