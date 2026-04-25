'use client'

import { type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TOption<T extends string> = {
	value: T
	label: ReactNode
}

type TSegmentedControl<T extends string> = {
	options: [TOption<T>, TOption<T>]
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
	const isSecond = value === options[1].value

	return (
		<div className={cn('bg-muted relative flex rounded-lg p-1', className)}>
			<div
				className={`bg-background absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md shadow-sm transition-transform duration-200 ${isSecond ? 'translate-x-full' : 'translate-x-0'}`}
			/>
			{options.map((opt) => (
				<button
					key={opt.value}
					onClick={() => onChange(opt.value)}
					className={`relative z-10 flex flex-1 items-center justify-center py-2 text-sm font-black uppercase transition-colors duration-200 ${
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
