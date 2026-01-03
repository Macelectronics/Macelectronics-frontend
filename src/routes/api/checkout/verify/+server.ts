import { json, type RequestHandler } from '@sveltejs/kit';
import { config } from '$lib/config';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { reference } = body;

		if (!reference) {
			return json({ success: false, error: 'Payment reference is required' }, { status: 400 });
		}

		// Call the backend API to verify payment
		const response = await fetch(`${config.apiUrl}/api/v1/storefront/payment/verify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ reference })
		});

		const result = await response.json();

		if (!response.ok) {
			return json({
				success: false,
				error: result.error || 'Failed to verify payment',
				status: result.status
			}, { status: response.status });
		}

		return json({
			success: true,
			status: result.status,
			orderId: result.orderId,
			orderNumber: result.orderNumber
		});
	} catch (error) {
		console.error('Verify checkout error:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
