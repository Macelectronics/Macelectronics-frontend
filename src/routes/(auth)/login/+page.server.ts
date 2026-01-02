import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { loginCustomer } from '$lib/server/api';

export const load: PageServerLoad = async ({ locals }) => {
	// If already logged in, redirect to dashboard
	if (locals.customer) {
		redirect(302, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const phoneNumber = formData.get('phoneNumber') as string;
		const password = formData.get('password') as string;

		// Validate inputs
		if (!phoneNumber || !password) {
			return fail(400, {
				error: 'Phone number and password are required',
				phoneNumber
			});
		}

		// Validate phone format
		const phoneRegex = /^0[235][0-9]{8}$/;
		if (!phoneRegex.test(phoneNumber)) {
			return fail(400, {
				error: 'Invalid phone number format. Use format: 0241234567',
				phoneNumber
			});
		}

		// Attempt login
		const response = await loginCustomer({ phoneNumber, password });

		if (!response.success) {
			return fail(401, {
				error: response.error || 'Invalid credentials',
				phoneNumber
			});
		}

		// Set session cookie
		if (response.token) {
			cookies.set('customer_token', response.token, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});
		}

		// Redirect to dashboard
		redirect(303, '/dashboard');
	}
};
