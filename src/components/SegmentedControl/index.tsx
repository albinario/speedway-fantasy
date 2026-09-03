'use client'

import { type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TOption<T extends string> = {
	value: T
	label: ReactNode
}

type TSegmentedControl<T extends string> = {
	options: TOption<T>[]
	value: T
	onChange: (value: T) => void
	className?: string
}

export function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	className
}: TSegmentedControl<T>) {
	const activeIndex = Math.max(
		0,
		options.findIndex((opt) => opt.value === value)
	)
	const count = options.length

	return (
		<div className={cn('bg-muted relative flex rounded-lg p-1', className)}>
			<div
				className="bg-background absolute inset-y-1 rounded-md shadow-sm transition-all duration-200"
				style={{
					width: `calc((100% - 8px) / ${count})`,
					left: `calc(4px + (100% - 8px) / ${count} * ${activeIndex})`
				}}
			/>

			{options.map((opt) => (
				<button
					key={opt.value}
					onClick={() => onChange(opt.value)}
					className={`relative z-10 flex flex-1 items-center justify-center py-2 text-sm font-black transition-colors duration-200 ${
						value === opt.value
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					{opt.label}
				</button>
			))}
		</div>
	)
}
