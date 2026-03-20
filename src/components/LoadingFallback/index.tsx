import { Spinner } from '@/components/ui/spinner'

type TLoadingFallback = {
	title: string
}

export function LoadingFallback({ title }: TLoadingFallback) {
	return (
		<div className="flex justify-center">
			<Spinner className="size-8 opacity-50" />
			{/* <span>{title} loading...</span> */}
		</div>
	)
}
