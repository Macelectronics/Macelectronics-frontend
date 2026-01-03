import { config } from '$lib/config';
import type { StorefrontData, CheckoutData, OrderInitResponse, Customer, CustomerOrder } from '$lib/types/bundle';

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
			accessCode: result.accessCode,
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

// ==================== CUSTOMER AUTHENTICATION ====================

export interface RegisterData {
	phoneNumber: string;
	password: string;
	email?: string;
	firstName?: string;
	lastName?: string;
}

export interface LoginData {
	phoneNumber: string;
	password: string;
}

export interface AuthResponse {
	success: boolean;
	error?: string;
	token?: string;
	customer?: Customer;
}

export interface CustomerOrdersResponse {
	success: boolean;
	error?: string;
	orders?: CustomerOrder[];
	pagination?: {
		page: number;
		limit: number;
		totalCount: number;
		totalPages: number;
		hasMore: boolean;
	};
}

/**
 * Register a new customer
 */
export async function registerCustomer(data: RegisterData): Promise<AuthResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/customer/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Registration failed'
			};
		}

		return {
			success: true,
			customer: result.customer
		};
	} catch (error) {
		console.error('Error registering customer:', error);
		return {
			success: false,
			error: 'Network error. Please try again.'
		};
	}
}

/**
 * Login customer
 */
export async function loginCustomer(data: LoginData): Promise<AuthResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/customer/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Login failed'
			};
		}

		return {
			success: true,
			token: result.token,
			customer: result.customer
		};
	} catch (error) {
		console.error('Error logging in customer:', error);
		return {
			success: false,
			error: 'Network error. Please try again.'
		};
	}
}

/**
 * Get current customer profile
 */
export async function getCustomerProfile(token: string): Promise<AuthResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/customer/me`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Failed to get profile'
			};
		}

		return {
			success: true,
			customer: result.customer
		};
	} catch (error) {
		console.error('Error getting customer profile:', error);
		return {
			success: false,
			error: 'Network error. Please try again.'
		};
	}
}

/**
 * Get customer orders
 */
export async function getCustomerOrders(token: string, page: number = 1): Promise<CustomerOrdersResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/customer/orders?page=${page}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Failed to get orders'
			};
		}

		return {
			success: true,
			orders: result.orders,
			pagination: result.pagination
		};
	} catch (error) {
		console.error('Error getting customer orders:', error);
		return {
			success: false,
			error: 'Network error. Please try again.'
		};
	}
}

/**
 * Logout customer (clear session on backend)
 */
export async function logoutCustomer(token: string): Promise<{ success: boolean }> {
	try {
		await fetch(`${config.apiUrl}/api/v1/customer/logout`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		return { success: true };
	} catch {
		return { success: true }; // Still consider it successful even if network fails
	}
}

// ==================== WALLET TOPUP ====================

export interface TopupInitializeData {
	amount: string;
	email?: string;
}

export interface TopupInitializeResponse {
	success: boolean;
	accessCode?: string;
	amount?: string;
	reference?: string;
	topupId?: string;
	error?: string;
	errorCode?: string;
}

export interface TopupVerifyResponse {
	success: boolean;
	error?: string;
	errorCode?: string;
	status?: string;
	message?: string;
	newBalance?: string;
}

/**
 * Initialize wallet topup with Paystack
 */
export async function initializeTopup(token: string, data: TopupInitializeData): Promise<TopupInitializeResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/customer/wallet/topup/initialize`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Failed to initialize topup',
				errorCode: result.errorCode
			};
		}

		return result;
	} catch (error) {
		console.error('Error initializing topup:', error);
		return {
			success: false,
			error: 'Network error. Please try again.',
			errorCode: 'NETWORK_ERROR'
		};
	}
}

/**
 * Verify wallet topup payment
 */
export async function verifyTopup(token: string, topupId: string): Promise<TopupVerifyResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/customer/wallet/topup/verify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ topupId })
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Failed to verify topup',
				errorCode: result.errorCode
			};
		}

		return result;
	} catch (error) {
		console.error('Error verifying topup:', error);
		return {
			success: false,
			error: 'Network error. Please try again.',
			errorCode: 'NETWORK_ERROR'
		};
	}
}

// ==================== PASSWORD RESET ====================

export interface ForgotPasswordResponse {
	success: boolean;
	error?: string;
	errorCode?: string;
	expiresAt?: number;
}

export interface ResetPasswordResponse {
	success: boolean;
	error?: string;
	errorCode?: string;
}

/**
 * Request password reset OTP
 */
export async function requestPasswordReset(phoneNumber: string): Promise<ForgotPasswordResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/customer/password/forgot`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phoneNumber })
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Failed to send reset code',
				errorCode: result.errorCode
			};
		}

		return result;
	} catch (error) {
		console.error('Error requesting password reset:', error);
		return {
			success: false,
			error: 'Network error. Please try again.',
			errorCode: 'NETWORK_ERROR'
		};
	}
}

/**
 * Reset password with OTP
 */
export async function resetPassword(phoneNumber: string, otpCode: string, newPassword: string): Promise<ResetPasswordResponse> {
	try {
		const response = await fetch(`${config.apiUrl}/api/v1/customer/password/reset`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phoneNumber, otpCode, newPassword })
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || 'Failed to reset password',
				errorCode: result.errorCode
			};
		}

		return result;
	} catch (error) {
		console.error('Error resetting password:', error);
		return {
			success: false,
			error: 'Network error. Please try again.',
			errorCode: 'NETWORK_ERROR'
		};
	}
}
