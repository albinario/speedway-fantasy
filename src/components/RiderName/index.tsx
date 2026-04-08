import Link from 'next/link'

type TRiderName = {
	name: string
	riderId: number
}

export function RiderName({ name, riderId }: TRiderName) {
	return (
		<Link className="truncate uppercase" href={`/riders/${riderId}`}>
			{name}
		</Link>
	)
}
