'use client'

import { useState } from 'react'

import { useTranslations } from 'next-intl'

import { toggleReminder } from '@/app/users/[id]/actions'
import { Switch } from '@/components/ui/switch'

type TReminderToggle = {
	defaultChecked: boolean
}

export function ReminderToggle({ defaultChecked }: TReminderToggle) {
	const t = useTranslations('Nav')
	const [checked, setChecked] = useState(defaultChecked)

	async function handleChange(value: boolean) {
		setChecked(value)
		await toggleReminder(value)
	}

	return (
		<div className="flex items-center gap-2">
			<Switch checked={checked} onCheckedChange={handleChange} />
			<span className="text-muted-foreground text-xs">
				{t('emailReminder')}
			</span>
		</div>
	)
}
