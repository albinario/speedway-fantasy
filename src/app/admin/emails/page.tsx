import { CopyButton } from './CopyButton'
import { getEmailList } from './data'

export default async function AdminEmailsPage() {
	const users = await getEmailList()

	return (
		<div className="space-y-3 p-2">
			<CopyButton text={users.map((u) => u.email).join(', ')} />
			<p className="text-muted-foreground text-xs whitespace-pre-wrap">
				{users.map((u) => u.email).join('\n')}
			</p>
		</div>
	)
}
