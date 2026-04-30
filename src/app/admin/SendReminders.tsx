'use server'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sendGpReminders } from '@/lib/reminders'

async function sendRemindersAction() {
	'use server'
	return sendGpReminders()
}

export async function SendReminders() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Race day reminders</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					action={async () => {
						'use server'
						await sendRemindersAction()
					}}
				>
					<Button type="submit" variant="outline">
						Send reminders
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
