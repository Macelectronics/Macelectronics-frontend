import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { initializeTopup, verifyTopup } from '$lib/server/api';

export const load: PageServerLoad = async ({ locals }) => {
	// Require authentication
	if (!locals.customer || !locals.customerToken) {
		redirect(302, '/login');
	}

	return {
		customer: locals.customer
	};
};

export const actions: Actions = {
	initialize: async ({ request, locals }) => {
		if (!locals.customer || !locals.customerToken) {
			return fail(401, { error: 'Authentication required' });
		}

		const formData = await request.formData();
		const amount = formData.get('amount')?.toString();
		const email = formData.get('email')?.toString() || undefined;

		if (!amount) {
			return fail(400, { error: 'Amount is required' });
		}

		// Validate amount is a positive number
		const amountNum = parseFloat(amount);
		if (isNaN(amountNum) || amountNum < 10) {
			return fail(400, { error: 'Minimum topup amount is GHS 10' });
		}

		if (amountNum > 10000) {
			return fail(400, { error: 'Maximum topup amount is GHS 10,000' });
		}

		const result = await initializeTopup(locals.customerToken, { amount, email });

		if (!result.success) {
			return fail(400, { error: result.error || 'Failed to initialize topup' });
		}

		return {
			success: true,
			accessCode: result.accessCode,
			amount: result.amount,
			reference: result.reference,
			topupId: result.topupId
		};
	},

	verify: async ({ request, locals }) => {
		if (!locals.customer || !locals.customerToken) {
			return fail(401, { error: 'Authentication required' });
		}

		const formData = await request.formData();
		const topupId = formData.get('topupId')?.toString();

		if (!topupId) {
			return fail(400, { error: 'Topup ID is required' });
		}

		const result = await verifyTopup(locals.customerToken, topupId);

		if (!result.success) {
			return fail(400, {
				error: result.error || 'Failed to verify payment',
				status: result.status
			});
		}

		return {
			success: true,
			message: result.message,
			newBalance: result.newBalance,
			status: result.status
		};
	}
};
