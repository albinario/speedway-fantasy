'use client'
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
import { paramKeys } from '@/lib/params'

import type { TYears } from './data'

type TYearSelectorProps = {
	years: TYears
	selectedYear: number
}

export function YearSelector({ years, selectedYear }: TYearSelectorProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const latestYear = years[0]?.value
	const showClearButton = Boolean(latestYear && selectedYear !== latestYear)

	const clearYear = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete(paramKeys.year)
		const queryString = params.toString()
		router.push(queryString ? `${pathname}?${queryString}` : pathname)
	}

	const updateYear = (year: number) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(paramKeys.year, String(year))
		router.push(`${pathname}?${params.toString()}`)
	}

	return (
		<DropdownMenu>
			<div className="flex items-center gap-2">
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="group flex items-center gap-2">
						<span>{selectedYear}</span>

						<ChevronDown
							aria-hidden
							className="size-4 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180"
						/>
					</Button>
				</DropdownMenuTrigger>

				{showClearButton && (
					<Button onClick={clearYear} variant="outline">
						<X aria-hidden className="size-4 text-white" /> Back to current year
					</Button>
				)}
			</div>

			<DropdownMenuContent className="w-10" align="start">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Years</DropdownMenuLabel>

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
					<DropdownMenuItem>All time</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
