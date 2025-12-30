import type { PageServerLoad } from './$types';
import { config } from '$lib/config';

interface OrderStatus {
	success: boolean;
	status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'PROCESSING';
	message: string;
	order?: {
		id: string;
		reference: string;
		bundleName: string;
		bundleCapacity: string;
		beneficiaryPhone: string;
		totalPrice: string;
		paymentStatus: string;
		createdAt: string;
	};
}

export const load: PageServerLoad = async ({ params, url }) => {
	const reference = params.reference;
	const trxref = url.searchParams.get('trxref');

	// Use trxref if available (Paystack callback), otherwise use reference from URL
	const paymentReference = trxref || reference;

	try {
		// Verify the payment with the backend
		const response = await fetch(`${config.apiUrl}/api/v1/storefront/payment/verify?reference=${paymentReference}`);

		if (!response.ok) {
			return {
				success: false,
				status: 'FAILED' as const,
				message: 'Could not verify payment status',
				reference: paymentReference
			};
		}

		const data = await response.json();

		return {
			success: data.success,
			status: data.status || (data.success ? 'SUCCESS' : 'FAILED'),
			message: data.message || (data.success ? 'Payment successful!' : 'Payment verification failed'),
			order: data.order,
			reference: paymentReference
		};
	} catch (error) {
		console.error('Error verifying payment:', error);
		return {
			success: false,
			status: 'FAILED' as const,
			message: 'Network error. Please check your order history or contact support.',
			reference: paymentReference
		};
	}
};
