import Image from 'next/image'
import Link from 'next/link'

import { Fragment } from 'react/jsx-runtime'

import { auth0 } from '@/lib/auth0'

import styles from './page.module.css'

import { getUserByAuth0Id } from '@/app/users/data'
import { logo } from '@/config/logo'

export default async function Home() {
	const session = await auth0.getSession()
	const authUser = session?.user
	const dbUser =
		authUser?.sub != null ? await getUserByAuth0Id(authUser.sub) : undefined

	return (
		<Fragment>
			<div className={styles.logoContainer}>
				<Image
					alt={logo.alt}
					height={logo.height}
					width={logo.width}
					priority
					src={logo.src}
				/>
			</div>

			<h1>Speedway Fantasy</h1>
			<p>Coming soon...</p>

			<div className={styles.content}>
				{authUser ? (
					<>
						<p>
							Signed in as{' '}
							{dbUser?.first_name ?? authUser.name ?? authUser.email}.
						</p>
						<a href="/auth/logout">Log out</a>
					</>
				) : (
					<a href="/auth/login">Log in</a>
				)}
				<Link href="/protected">User protected page</Link>
				<Link href="/admin">Admin protected page</Link>
			</div>
		</Fragment>
	)
}
