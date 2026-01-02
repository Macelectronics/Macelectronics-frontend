import type { Customer } from '$lib/types/bundle';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			customer?: Customer;
			customerToken?: string;
		}
		interface PageData {
			customer?: Customer;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
