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

export interface StorefrontBundle {
	id: string;
	bundleId: string;
	storefrontId: string;
	markupType: 'FIXED' | 'PERCENTAGE';
	markupValue: string;
	isVisible: boolean;
	displayOrder: number;
	customName: string | null;
	// Bundle details
	bundleName: string;
	bundleValue: string;
	bundleCapacity: string;
	bundleDuration: string;
	offerCode: string;
	offerName: string;
	// Computed
	basePrice: string;
	finalPrice: string;
	markupAmount: string;
}

export interface Storefront {
	id: string;
	agentId: string;
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
	isActive: boolean;
	isVerified: boolean;
}

export interface StorefrontData {
	storefront: Storefront;
	bundles: StorefrontBundle[];
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
