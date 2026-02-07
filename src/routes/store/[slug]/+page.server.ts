import type { PageServerLoad } from './$types';
import { getStorefrontData } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;

	const data = await getStorefrontData(slug);

	if (!data) {
		// Return empty data if storefront not found
		return {
			storefront: null,
			bundles: [],
			offerGroups: [],
			customer: locals.customer ?? null,
			notFound: true
		};
	}

	// API already pre-filters invisible bundles and pre-sorts by display_order
	return {
		storefront: data.storefront,
		bundles: data.bundles,
		offerGroups: data.offerGroups,
		customer: locals.customer ?? null,
		notFound: false
	};
};
