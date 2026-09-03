import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({
	className,
	size = 'default',
	...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(
				'group/card bg-card text-card-foreground flex flex-col gap-0 overflow-hidden rounded-xl text-sm has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-0 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
				className
			)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl p-3 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3',
				className
			)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				'text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
				className
			)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
				className
			)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div data-slot="card-content" className={cn('p-3', className)} {...props} />
	)
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				'bg-muted/50 flex items-center rounded-b-xl border-t p-3 group-data-[size=sm]/card:p-3',
				className
			)}
			{...props}
		/>
	)
}

type TCardGlowColor =
	| 'green'
	| 'orange'
	| 'yellow'
	| 'blue'
	| 'gold'
	| 'silver'
	| 'bronze'
	| 'red'

const cardGlowColorClasses: Record<TCardGlowColor, string> = {
	green: 'bg-green-400/10',
	orange: 'bg-orange-400/25',
	yellow: 'bg-yellow-400/20',
	blue: 'bg-blue-400/20',
	gold: 'bg-gold/20',
	silver: 'bg-silver/20',
	bronze: 'bg-bronze/20',
	red: 'bg-brand-red/20'
}

type TCardGlowPosition = 'center' | 'top' | 'bottom'

const cardGlowPositionClasses: Record<TCardGlowPosition, string> = {
	center: 'top-1/2 -translate-y-1/2',
	top: 'top-0 -translate-y-1/2',
	bottom: 'bottom-0 translate-y-1/2'
}

/**
 * Soft, blurred accent blob meant to sit behind a Card's content (`-z-10`) so
 * the tint reads as ambient light rather than an overlay. The parent Card
 * must have both `relative` and `isolate` — without `isolate`, Card has no
 * stacking context of its own, so this element's negative z-index escapes to
 * an ancestor context and gets painted behind Card's own opaque background,
 * making the glow invisible.
 */
function CardGlow({
	color = 'green',
	position = 'center',
	className
}: {
	color?: TCardGlowColor
	position?: TCardGlowPosition
	className?: string
}) {
	return (
		<div
			aria-hidden
			className={cn(
				'pointer-events-none absolute left-1/2 -z-10 size-40 -translate-x-1/2 rounded-full blur-3xl',
				cardGlowPositionClasses[position],
				cardGlowColorClasses[color],
				className
			)}
		/>
	)
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
	CardGlow
}
