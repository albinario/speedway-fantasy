import { HeatsFinished } from '@/components/HeatsFinished'

type TDuring = {
	heatsFinished: number
}

export function During({ heatsFinished }: TDuring) {
	return <HeatsFinished heatsFinished={heatsFinished} />
}
