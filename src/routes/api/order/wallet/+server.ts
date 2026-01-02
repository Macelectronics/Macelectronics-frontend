import { json, type RequestHandler } from '@sveltejs/kit';
import { config } from '$lib/config';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const token = cookies.get('customer_token');

		if (!token) {
			return json({ success: false, error: 'Not authenticated' }, { status: 401 });
		}

		const body = await request.json();
		const { storefrontBundleId, beneficiaryPhone } = body;

		if (!storefrontBundleId || !beneficiaryPhone) {
			return json({ success: false, error: 'Missing required fields' }, { status: 400 });
		}

		// Call the backend API
		const response = await fetch(`${config.apiUrl}/api/v1/customer/order/bundle`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				storefrontBundleId,
				beneficiaryPhone,
				paymentMethod: 'wallet'
			})
		});

		const result = await response.json();

		if (!response.ok) {
			return json({
				success: false,
				error: result.error || 'Failed to process order'
			}, { status: response.status });
		}

		return json(result);
	} catch (error) {
		console.error('Wallet order error:', error);
		return json({ success: false, error: 'Failed to process order' }, { status: 500 });
	}
};
