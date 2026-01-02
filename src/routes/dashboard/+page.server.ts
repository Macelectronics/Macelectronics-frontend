import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { getCustomerOrders, logoutCustomer } from '$lib/server/api';

export const load: PageServerLoad = async ({ locals, url }) => {
	// Require authentication
	if (!locals.customer || !locals.customerToken) {
		redirect(302, '/login');
	}

	// Get page from query params
	const page = parseInt(url.searchParams.get('page') || '1', 10);

	// Fetch orders
	const ordersResponse = await getCustomerOrders(locals.customerToken, page);

	return {
		customer: locals.customer,
		orders: ordersResponse.orders || [],
		pagination: ordersResponse.pagination || {
			page: 1,
			limit: 20,
			totalCount: 0,
			totalPages: 0,
			hasMore: false
		}
	};
};

export const actions: Actions = {
	logout: async ({ cookies, locals }) => {
		if (locals.customerToken) {
			await logoutCustomer(locals.customerToken);
		}

		cookies.delete('customer_token', { path: '/' });
		redirect(303, '/');
	}
};
