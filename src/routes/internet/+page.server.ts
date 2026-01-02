import type { PageServerLoad } from './$types';
import { getStorefrontData } from '$lib/server/api';

export const load: PageServerLoad = async ({ locals }) => {
	const data = await getStorefrontData();

	if (!data) {
		// Return empty bundles if storefront not found
		return {
			storefront: null,
			bundles: [],
			customer: locals.customer ?? null
		};
	}

	// Sort bundles by display order, then by price
	const sortedBundles = data.bundles
		.filter((b) => b.isVisible)
		.sort((a, b) => {
			if (a.displayOrder !== b.displayOrder) {
				return a.displayOrder - b.displayOrder;
			}
			return parseFloat(a.finalPrice) - parseFloat(b.finalPrice);
		});

	return {
		storefront: data.storefront,
		bundles: sortedBundles,
		customer: locals.customer ?? null
	};
};
