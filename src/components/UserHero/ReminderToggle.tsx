'use client'

import { useState } from 'react'

import { toggleReminder } from '@/app/users/[id]/actions'
import { Switch } from '@/components/ui/switch'

type TReminderToggle = {
	defaultChecked: boolean
}

export function ReminderToggle({ defaultChecked }: TReminderToggle) {
	const [checked, setChecked] = useState(defaultChecked)

	async function handleChange(value: boolean) {
		setChecked(value)
		await toggleReminder(value)
	}

	return (
		<div className="flex flex-col items-center gap-1.5">
			<Switch checked={checked} onCheckedChange={handleChange} />
			<span className="text-muted-foreground text-xs">Email reminder</span>
		</div>
	)
}
