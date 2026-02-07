<script lang="ts">
	import { useScrollAnimation } from '$lib/stores/scrollAnimation';
	import type { StorefrontBundle, Customer, OfferGroup, Storefront } from '$lib/types/bundle';
	import CheckoutModal from '$lib/components/CheckoutModal.svelte';

	interface PageData {
		storefront: Storefront | null;
		bundles: StorefrontBundle[];
		offerGroups: OfferGroup[];
		customer: Customer | null;
		notFound: boolean;
	}

	let { data }: { data: PageData } = $props();

	useScrollAnimation();

	let selectedBundle = $state<StorefrontBundle | null>(null);
	let showCheckout = $state(false);
	let displayedCount = $state(12);
	let activeTab = $state(data.offerGroups[0]?.offerCode || '');

	// Network colors for visual appeal
	const networkColors: Record<string, string> = {
		airteltigo: 'from-red-500 to-red-600',
		'at-ishare': 'from-red-500 to-red-600',
		mtn: 'from-yellow-500 to-yellow-600',
		vodafone: 'from-red-600 to-red-700',
		telecel: 'from-red-600 to-red-700'
	};

	function getNetworkColor(offerCode: string): string {
		const code = offerCode.toLowerCase();
		for (const [key, value] of Object.entries(networkColors)) {
			if (code.includes(key)) {
				return value;
			}
		}
		return 'from-blue-500 to-blue-600';
	}

	function getNetworkName(offerName: string): string {
		const name = offerName.toLowerCase();
		if (name.includes('airteltigo') || name.includes('at ') || name.includes('ishare')) {
			return 'AirtelTiGO';
		}
		if (name.includes('mtn')) {
			return 'MTN';
		}
		if (name.includes('vodafone') || name.includes('telecel')) {
			return 'Telecel';
		}
		return offerName;
	}

	/**
	 * Format bundle value for display (e.g., "5" -> "5 GB")
	 */
	function formatBundleValue(value: string): string {
		const numValue = parseFloat(value);
		if (numValue >= 1000) {
			return `${(numValue / 1000).toFixed(0)} TB`;
		}
		return `${numValue} GB`;
	}

	function loadMore() {
		displayedCount += 6;
	}

	function selectBundle(bundle: StorefrontBundle) {
		selectedBundle = bundle;
		showCheckout = true;
	}

	function closeCheckout() {
		showCheckout = false;
		selectedBundle = null;
	}

	// Get bundles for active tab
	let activeBundles = $derived(
		data.offerGroups.find((g) => g.offerCode === activeTab)?.bundles || []
	);
	let bundlesToShow = $derived(activeBundles.slice(0, displayedCount));
	let hasMoreBundles = $derived(displayedCount < activeBundles.length);
</script>

<svelte:head>
	{#if data.storefront}
		<title>{data.storefront.businessName} - Internet Data Bundles</title>
		<meta
			name="description"
			content="Buy internet data bundles from {data.storefront.businessName}. Fast delivery, affordable prices."
		/>
	{:else}
		<title>Store Not Found</title>
	{/if}
</svelte:head>

{#if data.notFound}
	<!-- Store Not Found -->
	<section class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="text-center px-4">
			<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
				<i class="fas fa-store-slash text-gray-400 text-4xl"></i>
			</div>
			<h1 class="text-3xl font-display font-bold text-navy-900 mb-4">Store Not Found</h1>
			<p class="text-gray-600 max-w-md mx-auto mb-8">
				The store you're looking for doesn't exist or may have been deactivated.
			</p>
			<a
				href="/"
				class="inline-flex items-center bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-3 px-6 rounded-lg transition-colors"
			>
				<i class="fas fa-home mr-2"></i>
				Go to Home
			</a>
		</div>
	</section>
{:else if data.storefront}
	<!-- Hero Section with Store Branding -->
	<section class="relative overflow-hidden" style="background: linear-gradient(135deg, {data.storefront.primaryColor}, {data.storefront.secondaryColor});">
		<div class="absolute inset-0 bg-black/20"></div>

		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
			<div class="text-center">
				<!-- Store Logo -->
				{#if data.storefront.logoUrl}
					<img
						src={data.storefront.logoUrl}
						alt={data.storefront.businessName}
						class="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-4 border-white/30 shadow-xl"
					/>
				{:else}
					<div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30">
						<i class="fas fa-store text-white text-3xl"></i>
					</div>
				{/if}

				<!-- Store Name & Verification -->
				<div class="flex items-center justify-center gap-2 mb-4">
					<h1 class="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white">
						{data.storefront.businessName}
					</h1>
					{#if data.storefront.isVerified}
						<span class="inline-flex items-center bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
							<i class="fas fa-check-circle mr-1"></i> Verified
						</span>
					{/if}
				</div>

				{#if data.storefront.description}
					<p class="text-lg text-white/90 max-w-2xl mx-auto mb-8">
						{data.storefront.description}
					</p>
				{/if}

				<!-- Contact Info -->
				<div class="flex flex-wrap items-center justify-center gap-4 text-white/80">
					{#if data.storefront.phoneNumber}
						<a href="tel:{data.storefront.phoneNumber}" class="flex items-center gap-2 hover:text-white transition-colors">
							<i class="fas fa-phone"></i>
							{data.storefront.phoneNumber}
						</a>
					{/if}
					{#if data.storefront.whatsappNumber}
						<a href="https://wa.me/{data.storefront.whatsappNumber.replace(/[^0-9]/g, '')}" target="_blank" class="flex items-center gap-2 hover:text-white transition-colors">
							<i class="fab fa-whatsapp"></i>
							WhatsApp
						</a>
					{/if}
					{#if data.storefront.email}
						<a href="mailto:{data.storefront.email}" class="flex items-center gap-2 hover:text-white transition-colors">
							<i class="fas fa-envelope"></i>
							{data.storefront.email}
						</a>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Data Plans Section -->
	<section id="plans" class="py-16 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-12">
				<h2 class="text-3xl lg:text-4xl font-display font-bold text-navy-900 mb-4">
					Available Data Plans
				</h2>
				<p class="text-lg text-gray-600">
					Choose from our selection of affordable data bundles
				</p>
			</div>

			{#if data.bundles.length === 0}
				<!-- No bundles available -->
				<div class="text-center py-16">
					<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<i class="fas fa-box-open text-gray-400 text-4xl"></i>
					</div>
					<h3 class="text-2xl font-display font-bold text-navy-900 mb-4">No Plans Available</h3>
					<p class="text-gray-600 max-w-md mx-auto">
						This store doesn't have any data plans available yet. Please check back later.
					</p>
				</div>
			{:else}
				<!-- Offer Tabs -->
				{#if data.offerGroups.length > 1}
					<div class="flex flex-wrap justify-center gap-2 mb-8">
						{#each data.offerGroups as group}
							<button
								onclick={() => { activeTab = group.offerCode; displayedCount = 12; }}
								class="px-6 py-3 rounded-lg font-medium transition-all {activeTab === group.offerCode
									? 'bg-primary-400 text-navy-900 shadow-md'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							>
								{getNetworkName(group.offerName)}
								<span class="ml-2 text-sm opacity-75">({group.bundles.length})</span>
							</button>
						{/each}
					</div>
				{/if}

				<!-- Plans Grid -->
				<div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each bundlesToShow as bundle}
						<div class="plan-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
							<div class="text-center">
								<div class="flex items-center justify-center mb-4">
									<div class="w-12 h-12 bg-gradient-to-br {getNetworkColor(bundle.offerCode)} rounded-xl flex items-center justify-center mr-3">
										<i class="fas fa-signal text-white text-xl"></i>
									</div>
									<div class="text-left">
										<div class="text-sm font-semibold text-primary-600">{getNetworkName(bundle.offerName)}</div>
										<div class="text-2xl font-bold text-navy-900">{formatBundleValue(bundle.value)}</div>
									</div>
								</div>

								<div class="bg-gradient-to-r {getNetworkColor(bundle.offerCode)} text-white p-4 rounded-lg mb-6">
									<div class="grid grid-cols-3 gap-4 text-sm">
										<div>
											<div class="font-bold">GHS {parseFloat(bundle.price).toFixed(2)}</div>
											<div>Price</div>
										</div>
										<div>
											<div class="font-bold">Yes</div>
											<div>Rollover</div>
										</div>
										<div>
											<div class="font-bold">60 Days</div>
											<div>Duration</div>
										</div>
									</div>
								</div>

								<button
									onclick={() => selectBundle(bundle)}
									class="w-full bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
								>
									Select Plan
								</button>
							</div>
						</div>
					{/each}
				</div>

				<!-- Load More Button -->
				{#if hasMoreBundles}
					<div class="text-center mt-10">
						<button
							onclick={loadMore}
							class="px-8 py-3 bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
						>
							Load More Plans
						</button>
					</div>
				{/if}
			{/if}
		</div>
	</section>

	<!-- Footer with powered by -->
	<section class="py-8 bg-gray-50 border-t border-gray-200">
		<div class="max-w-7xl mx-auto px-4 text-center">
			<p class="text-gray-500 text-sm">
				Powered by <a href="/" class="text-primary-600 hover:underline font-medium">Macelectronics</a>
			</p>
		</div>
	</section>
{/if}

<!-- Checkout Modal -->
{#if showCheckout && selectedBundle}
	<CheckoutModal bundle={selectedBundle} customer={data.customer} onClose={closeCheckout} />
{/if}
