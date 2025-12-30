import { config } from '$lib/config';
import type { StorefrontData, CheckoutData, OrderInitResponse } from '$lib/types/bundle';

/**
 * Fetch storefront data from the backend API
 */
export async function getStorefrontData(): Promise<StorefrontData | null> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/storefront/${config.storefrontSlug}`);

		if (!response.ok) {
			console.error('Failed to fetch storefront data:', response.status, response.statusText);
			return null;
		}

		const data = await response.json();

		if (!data.success) {
			console.error('Storefront API returned error:', data.error);
			return null;
		}

		return {
			storefront: data.storefront,
			bundles: data.bundles
		};
	} catch (error) {
		console.error('Error fetching storefront data:', error);
		return null;
	}
}

/**
 * Initialize a payment for storefront purchase
 */
export async function initializePayment(data: CheckoutData): Promise<OrderInitResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/storefront/${config.storefrontSlug}/order/initialize`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				storefrontBundleId: data.storefrontBundleId,
				beneficiaryPhone: data.beneficiaryPhone,
				customerPhone: data.customerPhone,
				customerEmail: data.customerEmail,
				customerName: data.customerName
			})
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Payment initialization failed'
			};
		}

		return {
			success: true,
			authorizationUrl: result.authorizationUrl,
			reference: result.reference,
			orderId: result.orderId
		};
	} catch (error) {
		console.error('Error initializing payment:', error);
		return {
			success: false,
			error: 'Network error. Please try again.'
		};
	}
}
