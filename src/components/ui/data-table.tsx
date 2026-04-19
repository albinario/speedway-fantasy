'use client'

import { useState } from 'react'

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable
} from '@tanstack/react-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData, TValue> {
		className?: string
	}
}

type TDataTable<TData> = {
	columns: ColumnDef<TData>[]
	data: TData[]
	hideHeader?: boolean
	getRowClassName?: (row: TData) => string | undefined
}

export function DataTable<TData>({
	columns,
	data,
	hideHeader,
	getRowClassName
}: TDataTable<TData>) {
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		sortDescFirst: true
	})

	return (
		<Table>
			{!hideHeader && (
				<TableHeader className="sticky top-0 z-10 bg-black/65 backdrop-blur-sm">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="bg-muted/50">
							{headerGroup.headers.map((header) => {
								const canSort = header.column.getCanSort()
								const sorted = header.column.getIsSorted()
								const meta = header.column.columnDef.meta

								return (
									<TableHead
										key={header.id}
										className={cn(
											meta?.className,
											canSort && 'cursor-pointer select-none'
										)}
										onClick={
											canSort
												? header.column.getToggleSortingHandler()
												: undefined
										}
									>
										{header.isPlaceholder ? null : (
											<span className="inline-flex items-center gap-1">
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{canSort && (
													<span className="text-muted-foreground text-xs">
														{sorted === 'asc'
															? '↑'
															: sorted === 'desc'
																? '↓'
																: '↕'}
													</span>
												)}
											</span>
										)}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
			)}

			<TableBody>
				{table.getRowModel().rows.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow key={row.id} className={getRowClassName?.(row.original)}>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className={cell.column.columnDef.meta?.className}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length}>No results.</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}
