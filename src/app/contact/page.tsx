import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { Mail } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { getPageMetadata } from '@/i18n/page-metadata'
import { getViewer } from '@/lib/auth/get-viewer'

import { sendContactMessage } from './actions'
import { ContactForm } from './Form'

export const generateMetadata = () => getPageMetadata('contact')

export default async function ContactPage() {
	const viewer = await getViewer()

	if (viewer.isAuthenticated && !viewer.db?.first_name) redirect('/onboarding')

	const t = await getTranslations('Contact')

	return (
		<div className="mx-auto flex max-w-lg flex-col gap-4">
			<PageHeader hideYearSelector>
				<span className="flex items-center gap-2 text-xl font-black uppercase">
					{t('title')}
					<Mail className="size-6" />
				</span>
			</PageHeader>

			<Card>
				<ContactForm
					action={sendContactMessage}
					email={viewer.db?.email}
				/>
			</Card>
		</div>
	)
}
