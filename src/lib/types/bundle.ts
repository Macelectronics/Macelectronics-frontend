// Bundle and Storefront types for the public site

export interface Bundle {
	id: string;
	name: string;
	value: string;
	capacity: string;
	duration: string;
	offerCode: string;
	offerName: string;
}

/**
 * Public storefront bundle as returned by the API
 * Note: API pre-filters invisible bundles and pre-sorts by display_order
 */
export interface StorefrontBundle {
	id: string;
	bundleId: string;
	name: string;
	value: string;
	price: string; // Final price including markup
	offerCode: string;
	offerName: string;
	offerProvider: string;
}

/**
 * Public storefront data as returned by the API
 */
export interface Storefront {
	slug: string;
	businessName: string;
	description: string | null;
	logoUrl: string | null;
	bannerUrl: string | null;
	primaryColor: string;
	secondaryColor: string;
	phoneNumber: string | null;
	whatsappNumber: string | null;
	email: string | null;
	socialLinks: Record<string, string>;
	isVerified: boolean;
}

/**
 * Bundles grouped by offer for tabbed display
 */
export interface OfferGroup {
	offerCode: string;
	offerName: string;
	offerProvider: string;
	bundles: StorefrontBundle[];
}

export interface StorefrontData {
	storefront: Storefront;
	bundles: StorefrontBundle[];
	offerGroups: OfferGroup[];
}

export interface CheckoutData {
	storefrontBundleId: string;
	beneficiaryPhone: string;
	customerPhone: string;
	customerEmail?: string;
	customerName?: string;
}

export interface OrderInitResponse {
	success: boolean;
	authorizationUrl?: string;
	accessCode?: string;
	reference?: string;
	orderId?: string;
	error?: string;
}

// Customer types - unified with main user system
export interface Customer {
	id: string;
	phoneNumber: string;
	email: string;
	firstName: string;
	lastName: string;
	accountStatus?: string;
	tier: string; // CUSTOMER, AGENT, DEALER, etc.
	agentNumber?: string | null;
	walletBalance: string;
}

export interface CustomerOrder {
	id: string;
	orderNumber: string;
	status: string;
	bundleValue: string;
	bundleName: string;
	beneficiaryPhone: string;
	amount: string;
	paymentMethod: string;
	createdAt: number;
}
