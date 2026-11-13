'use client'

import { useState } from 'react'

import { useTranslations } from 'next-intl'

import { ArrowLeftRight } from 'lucide-react'

import { PickRidersSheet } from '@/components/PickRidersSheet'
import type { TFieldRider } from '@/components/PickRidersSheet/data'
import { Button } from '@/components/ui/button'

type TTradeButton = {
	gpId: number
	riders: TFieldRider[]
	initialPicks: [number, number, number] | null
	/** Icon-only button, sized like the header's menu button */
	compact?: boolean
	/** Transfer window closed */
	disabled?: boolean
}

export function TradeButton({
	initialPicks,
	compact = false,
	disabled = false,
	...props
}: TTradeButton) {
	const t = useTranslations('MyTeam')
	const [open, setOpen] = useState(false)
	const [savedPicks, setSavedPicks] = useState(initialPicks)
	const label = savedPicks ? t('trade') : t('buyTeam')

	return (
		<>
			{compact ? (
				<Button
					aria-label={label}
					onClick={() => setOpen(true)}
					size="icon-lg"
					title={label}
					variant="outline"
				>
					<ArrowLeftRight />
				</Button>
			) : (
				<Button
					className="w-full"
					disabled={disabled}
					onClick={() => setOpen(true)}
					size="lg"
					variant="outline"
				>
					<ArrowLeftRight className="size-4" />
					{label}
				</Button>
			)}

			<PickRidersSheet
				{...props}
				initialPicks={savedPicks}
				onOpenChange={setOpen}
				onSaved={setSavedPicks}
				open={open}
			/>
		</>
	)
}
