import { Spinner } from '@/components/ui/spinner'

export function LoadingFallback() {
	return (
		<div className="flex justify-center">
			<Spinner className="size-8 opacity-50" />
		</div>
	)
}
