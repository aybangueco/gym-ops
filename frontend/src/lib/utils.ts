import { type ClassValue, clsx } from 'clsx';
import { readable } from 'svelte/store';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line
// @ts-ignore
export function runes_to_store(cb) {
	readable(cb, (set) =>
		$effect.root(() => {
			$effect.pre(() => {
				set(cb());
			});
		})
	);
}
