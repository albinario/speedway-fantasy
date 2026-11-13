'use client'

import { useState, useTransition } from 'react'

import { useTranslations } from 'next-intl'

import { LogIn } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

import type { sendContactMessage } from './actions'
import { MESSAGE_MAX, MESSAGE_MIN } from './constants'

type TContactForm = {
	action: typeof sendContactMessage
	// Account email; undefined when logged out
	email?: string
}

export function ContactForm({ action, email }: TContactForm) {
	const t = useTranslations('Contact')
	const [isPending, startTransition] = useTransition()
	const [message, setMessage] = useState('')

	const isLoggedIn = email != null
	const disabled = message.trim().length < MESSAGE_MIN || isPending

	function handleAction(formData: FormData) {
		startTransition(async () => {
			const result = await action(formData)

			if (result.error) {
				toast.error(t(result.error))
				return
			}

			setMessage('')
			toast.success(t('sentTitle'), { description: t('sentDescription') })
		})
	}

	return (
		<>
			<CardContent>
				<form id="contact-form" action={handleAction}>
					<div className="flex flex-col gap-2">
						<Textarea
							aria-describedby="contact-info"
							aria-label={t('message')}
							autoFocus={isLoggedIn}
							className="min-h-32"
							disabled={!isLoggedIn}
							maxLength={MESSAGE_MAX}
							minLength={MESSAGE_MIN}
							name="message"
							onChange={(e) => setMessage(e.target.value)}
							placeholder={t('messagePlaceholder')}
							required
							value={message}
						/>

						<div className="text-muted-foreground flex justify-between gap-4 text-xs">
							<p id="contact-info">
								{isLoggedIn
									? t.rich('replyInfo', {
											email,
											strong: (chunks) => (
												<strong className="text-foreground">{chunks}</strong>
											)
										})
									: t('logInInfo')}
							</p>
							{isLoggedIn && (
								<p className="shrink-0">
									{message.length}/{MESSAGE_MAX}
								</p>
							)}
						</div>
					</div>
				</form>
			</CardContent>

			<CardFooter>
				{isLoggedIn ? (
					<Button
						type="submit"
						form="contact-form"
						className="w-full"
						disabled={disabled}
						size="lg"
					>
						{isPending ? t('sending') : t('submit')}
					</Button>
				) : (
					<Button asChild className="w-full" size="lg">
						<a href="/auth/login?returnTo=/contact">
							{t('logIn')} <LogIn />
						</a>
					</Button>
				)}
			</CardFooter>
		</>
	)
}
