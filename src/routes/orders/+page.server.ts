import type { Actions, PageServerLoad } from './$types';
import { config } from '$lib/config';
import { fail } from '@sveltejs/kit';

export interface OrderItem {
	id: string;
	reference: string;
	bundleName: string;
	bundleCapacity: string;
	beneficiaryPhone: string;
	totalPrice: string;
	paymentStatus: string;
	orderStatus: string;
	offerName: string;
	offerProvider: string;
	storefrontName: string;
	createdAt: string;
}

export const load: PageServerLoad = async ({ url }) => {
	const phone = url.searchParams.get('phone');

	if (!phone) {
		return { orders: null, phone: null };
	}

	try {
		const response = await fetch(
			`${config.apiUrl}/api/v1/storefront/orders?phone=${encodeURIComponent(phone)}`
		);

		if (!response.ok) {
			return { orders: [], phone, error: 'Failed to fetch orders' };
		}

		const data = await response.json();

		if (!data.success) {
			return { orders: [], phone, error: data.error || 'No orders found' };
		}

		return {
			orders: data.orders as OrderItem[],
			phone
		};
	} catch (error) {
		console.error('Error fetching orders:', error);
		return { orders: [], phone, error: 'Network error' };
	}
};

export const actions = {
	lookup: async ({ request }) => {
		const formData = await request.formData();
		const phone = formData.get('phone') as string;

		if (!phone) {
			return fail(400, { error: 'Phone number is required', phone: '' });
		}

		// Validate phone format
		const phoneRegex = /^0[235][0-9]{8}$/;
		if (!phoneRegex.test(phone)) {
			return fail(400, { error: 'Invalid phone number format', phone });
		}

		// Redirect to the same page with phone as query param
		return { success: true, phone };
	}
} satisfies Actions;
