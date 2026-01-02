import type { Handle } from '@sveltejs/kit';
import { getCustomerProfile } from '$lib/server/api';

export const handle: Handle = async ({ event, resolve }) => {
	// Get token from cookie
	const token = event.cookies.get('customer_token');

	if (token) {
		// Verify token and get customer
		const response = await getCustomerProfile(token);

		if (response.success && response.customer) {
			event.locals.customer = response.customer;
			event.locals.customerToken = token;
		} else {
			// Token is invalid, clear it
			event.cookies.delete('customer_token', { path: '/' });
		}
	}

	return resolve(event);
};
