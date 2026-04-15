import { YearSelector } from '@/components/YearSelector'
import { getYears } from '@/data/year'

type TPageHeader = {
	children?: React.ReactNode
	hideYearSelector?: boolean
	title?: string | null
}

export async function PageHeader({
	children,
	hideYearSelector = false,
	title
}: TPageHeader) {
	const years = hideYearSelector ? null : await getYears()

	return (
		<div className="flex flex-wrap items-center justify-between gap-2 p-4">
			{children ?? (
				<span className="text-xl font-black uppercase">{title}</span>
			)}

			{years && (
				<div className="ml-auto">
					<YearSelector years={years} />
				</div>
			)}
		</div>
	)
}
