import { redirect } from 'next/navigation'

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { getViewer } from '@/lib/auth/get-viewer'

import { saveProfile } from './actions'
import { OnboardingForm } from './Form'

export default async function OnboardingPage() {
	const viewer = await getViewer()

	if (!viewer.isAuthenticated) redirect('/auth/login')
	if (viewer.db?.first_name) redirect('/')

	return (
		<div className="flex min-h-full items-center justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Welcome to Speedway Fantasy</CardTitle>
					<CardDescription>Enter your name to continue.</CardDescription>
				</CardHeader>

				<OnboardingForm action={saveProfile} />
			</Card>
		</div>
	)
}
