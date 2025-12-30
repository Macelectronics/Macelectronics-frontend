import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const config = {
	apiUrl: env.API_URL || 'http://localhost:5174',
	storefrontSlug: env.STOREFRONT_SLUG || 'main',
	paystackPublicKey: publicEnv.PUBLIC_PAYSTACK_PUBLIC_KEY || '',
	siteUrl: publicEnv.PUBLIC_SITE_URL || 'http://localhost:5175'
};
