import { Spinner } from '@/components/ui/spinner'

export function LoadingFallback() {
	return (
		<div className="flex justify-center p-3">
			<Spinner className="size-8 opacity-50" />
		</div>
	)
}
