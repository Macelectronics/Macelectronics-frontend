import { json, type RequestHandler } from '@sveltejs/kit';
import { initializePayment } from '$lib/server/api';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.storefrontBundleId || !data.beneficiaryPhone) {
			return json({ success: false, error: 'Missing required fields' }, { status: 400 });
		}

		// Validate phone number format (Ghana)
		const phoneRegex = /^0[235][0-9]{8}$/;
		if (!phoneRegex.test(data.beneficiaryPhone)) {
			return json({ success: false, error: 'Invalid phone number format' }, { status: 400 });
		}

		const customerPhone = data.customerPhone || data.beneficiaryPhone;
		if (!phoneRegex.test(customerPhone)) {
			return json({ success: false, error: 'Invalid customer phone number format' }, { status: 400 });
		}

		// Initialize payment with backend
		const result = await initializePayment({
			storefrontBundleId: data.storefrontBundleId,
			beneficiaryPhone: data.beneficiaryPhone,
			customerPhone,
			customerEmail: data.customerEmail,
			customerName: data.customerName
		});

		if (!result.success) {
			return json({ success: false, error: result.error }, { status: 400 });
		}

		return json({
			success: true,
			authorizationUrl: result.authorizationUrl,
			reference: result.reference,
			orderId: result.orderId
		});
	} catch (error) {
		console.error('Checkout error:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
