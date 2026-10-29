'use client'

import { useState } from 'react'

import {
	type ColumnDef,
	createSortedRowModel,
	flexRender,
	type RowData,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	type SortingState,
	tableFeatures,
	useTable
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

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
	columnMeta: {} as { className?: string }
})

export type TColumnDef<TData extends RowData> = ColumnDef<
	typeof features,
	TData
>

type TDataTable<TData extends RowData> = {
	columns: TColumnDef<TData>[]
	data: TData[]
	hideHeader?: boolean
	getRowClassName?: (row: TData) => string | undefined
	// Pins matching rows below the header / above the footer while out of view.
	// Sticky needs a non-scrolling ancestor chain, so wrap in overflow-clip, not overflow-hidden
	getRowSticky?: (row: TData) => boolean
	// 'page' pins against the app header/footer; 'container' against a scrolling parent's edges
	stickyScope?: 'page' | 'container'
}

export function DataTable<TData extends RowData>({
	columns,
	data,
	hideHeader,
	getRowClassName,
	getRowSticky,
	stickyScope = 'page'
}: TDataTable<TData>) {
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useTable({
		features,
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		sortDescFirst: true
	})

	const hasSticky = !!getRowSticky
	const pinToPage = hasSticky && stickyScope === 'page'

	return (
		<Table containerClassName={cn(hasSticky && 'overflow-visible')}>
			{!hideHeader && (
				<TableHeader
					className={cn(
						'sticky top-0 z-10 bg-black/65 backdrop-blur-sm',
						pinToPage && 'top-(--header-h)'
					)}
				>
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
						<TableRow
							key={row.id}
							className={cn(
								getRowSticky?.(row.original) && [
									'bg-card sticky z-5 shadow-[0_0_12px_rgb(0_0_0/0.6)]',
									pinToPage
										? [
												'bottom-(--footer-h)',
												hideHeader
													? 'top-(--header-h)'
													: 'top-[calc(var(--header-h)+2.5rem)]'
											]
										: ['bottom-0', hideHeader ? 'top-0' : 'top-10']
								],
								getRowClassName?.(row.original)
							)}
						>
							{row.getAllCells().map((cell) => (
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
