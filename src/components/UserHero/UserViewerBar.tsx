import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { ReminderToggle } from './ReminderToggle'

type TUserViewerBar = {
	reminder: boolean
}

export function UserViewerBar({ reminder }: TUserViewerBar) {
	return (
		<Card>
			<CardContent className="flex items-center justify-end gap-4">
				<ReminderToggle defaultChecked={reminder} />
				<Button asChild variant="destructive" size="lg">
					<a href="/auth/logout">
						Log out
						<LogOut />
					</a>
				</Button>
			</CardContent>
		</Card>
	)
}
