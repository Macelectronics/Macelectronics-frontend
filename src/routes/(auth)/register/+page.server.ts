import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { registerCustomer } from '$lib/server/api';

export const load: PageServerLoad = async ({ locals }) => {
	// If already logged in, redirect to dashboard
	if (locals.customer) {
		redirect(302, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const phoneNumber = formData.get('phoneNumber') as string;
		const email = formData.get('email') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// Validate required fields
		if (!phoneNumber || !password) {
			return fail(400, {
				error: 'Phone number and password are required',
				phoneNumber,
				email,
				firstName,
				lastName
			});
		}

		// Validate phone format
		const phoneRegex = /^0[235][0-9]{8}$/;
		if (!phoneRegex.test(phoneNumber)) {
			return fail(400, {
				error: 'Invalid phone number format. Use format: 0241234567',
				phoneNumber,
				email,
				firstName,
				lastName
			});
		}

		// Validate password length
		if (password.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters',
				phoneNumber,
				email,
				firstName,
				lastName
			});
		}

		// Validate password match
		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match',
				phoneNumber,
				email,
				firstName,
				lastName
			});
		}

		// Validate email if provided
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, {
				error: 'Invalid email format',
				phoneNumber,
				email,
				firstName,
				lastName
			});
		}

		// Attempt registration
		const response = await registerCustomer({
			phoneNumber,
			password,
			email: email || undefined,
			firstName: firstName || undefined,
			lastName: lastName || undefined
		});

		if (!response.success) {
			return fail(400, {
				error: response.error || 'Registration failed',
				phoneNumber,
				email,
				firstName,
				lastName
			});
		}

		// Registration successful - redirect to login with success message
		redirect(303, '/login?registered=true');
	}
};
