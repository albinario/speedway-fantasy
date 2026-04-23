import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ReminderToggle } from './ReminderToggle'

type TUserViewerBar = {
	reminder: boolean
}

export function UserViewerBar({ reminder }: TUserViewerBar) {
	return (
		<div className="flex items-center gap-4">
			<ReminderToggle defaultChecked={reminder} />

			<Button asChild variant="destructive">
				<a href="/auth/logout">
					Log out
					<LogOut />
				</a>
			</Button>
		</div>
	)
}
