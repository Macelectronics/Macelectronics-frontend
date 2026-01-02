import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { requestPasswordReset, resetPassword } from '$lib/server/api';

export const actions: Actions = {
	requestOTP: async ({ request }) => {
		const formData = await request.formData();
		const phoneNumber = formData.get('phoneNumber')?.toString();

		if (!phoneNumber) {
			return fail(400, { error: 'Phone number is required', step: 'phone' });
		}

		const result = await requestPasswordReset(phoneNumber);

		if (!result.success) {
			return fail(400, {
				error: result.error || 'Failed to send reset code',
				phoneNumber,
				step: 'phone'
			});
		}

		return {
			success: true,
			phoneNumber,
			expiresAt: result.expiresAt,
			step: 'otp'
		};
	},

	resetPassword: async ({ request }) => {
		const formData = await request.formData();
		const phoneNumber = formData.get('phoneNumber')?.toString();
		const otpCode = formData.get('otpCode')?.toString();
		const newPassword = formData.get('newPassword')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!phoneNumber || !otpCode || !newPassword || !confirmPassword) {
			return fail(400, {
				error: 'All fields are required',
				phoneNumber,
				step: 'otp'
			});
		}

		if (newPassword !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match',
				phoneNumber,
				step: 'otp'
			});
		}

		if (newPassword.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters',
				phoneNumber,
				step: 'otp'
			});
		}

		const result = await resetPassword(phoneNumber, otpCode, newPassword);

		if (!result.success) {
			return fail(400, {
				error: result.error || 'Failed to reset password',
				phoneNumber,
				step: 'otp'
			});
		}

		// Redirect to login with success message
		redirect(303, '/login?reset=true');
	}
};
