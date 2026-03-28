type TGpCardBefore = {
	isLoggedIn?: boolean
	isUpNext?: boolean
}

export function Before({
	isLoggedIn = false,
	isUpNext = false
}: TGpCardBefore) {
	return (
		<div className="flex flex-col gap-2">
			{isUpNext && isLoggedIn && <p className="text-sm">[pick riders]</p>}
		</div>
	)
}
