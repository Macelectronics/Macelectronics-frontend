<script lang="ts">
	import { useScrollAnimation } from '$lib/stores/scrollAnimation';
	import type { StorefrontBundle, Customer } from '$lib/types/bundle';
	import CheckoutModal from '$lib/components/CheckoutModal.svelte';

	interface PageData {
		storefront: {
			businessName: string;
			primaryColor: string;
		} | null;
		bundles: StorefrontBundle[];
		customer: Customer | null;
	}

	let { data }: { data: PageData } = $props();

	useScrollAnimation();

	let selectedBundle = $state<StorefrontBundle | null>(null);
	let showCheckout = $state(false);
	let displayedCount = $state(12);

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

	let bundlesToShow = $derived(data.bundles.slice(0, displayedCount));
	let hasMoreBundles = $derived(displayedCount < data.bundles.length);
</script>

<svelte:head>
	<title>Internet Data Plans - Macelectronics | Best Data Bundles in Ghana</title>
	<meta
		name="description"
		content="Get the best internet data plans in Ghana with Macelectronics. AirtelTiGO, MTN, Vodafone data bundles with rollover. Fast, affordable, and reliable internet packages."
	/>
	<meta name="keywords" content="Ghana data plans, internet bundles, AirtelTiGO data, MTN data, Vodafone data, mobile data Ghana, data packages, rollover data" />
</svelte:head>

<!-- Hero Section -->
<section class="gradient-bg relative overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-br from-navy-900/90 to-navy-800/90"></div>

	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
		<div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
		<div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
			<!-- Content -->
			<div class="text-center lg:text-left animate-fade-in-up">
				<div class="inline-flex items-center bg-primary-400/20 backdrop-blur-sm border border-primary-400/30 rounded-full px-4 py-2 mb-6">
					<i class="fas fa-wifi text-primary-400 mr-2"></i>
					<span class="text-primary-300 font-medium">Internet Data Plans</span>
				</div>

				<h1 class="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white leading-[1.1] mb-8 tracking-tight">
					Cut Down on Your Yearly
					<span class="text-primary-400 bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">Internet Bill</span>
					with Macelectronics
				</h1>

				<p class="text-xl text-gray-300 mb-8 leading-relaxed">
					Get the real deal with Macelectronics. Choose from our wide range of affordable data plans with rollover benefits and enjoy seamless connectivity across all major networks in
					Ghana.
				</p>

				<!-- Features -->
				<div class="space-y-4 mb-10">
					<div class="flex items-center text-left animate-slide-in-left" style="animation-delay: 0.2s;">
						<div class="w-2 h-2 bg-primary-400 rounded-full mr-4"></div>
						<span class="text-lg text-gray-200">All plans come with data rollover</span>
					</div>
					<div class="flex items-center text-left animate-slide-in-left" style="animation-delay: 0.4s;">
						<div class="w-2 h-2 bg-primary-400 rounded-full mr-4"></div>
						<span class="text-lg text-gray-200">Instant activation within 3 seconds</span>
					</div>
					<div class="flex items-center text-left animate-slide-in-left" style="animation-delay: 0.6s;">
						<div class="w-2 h-2 bg-primary-400 rounded-full mr-4"></div>
						<span class="text-lg text-gray-200">Support for all major networks</span>
					</div>
				</div>

				<!-- CTA Button -->
				<div class="animate-scale-in" style="animation-delay: 0.8s;">
					<a
						href="#plans"
						class="inline-flex items-center bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
					>
						Browse Data Plans
						<i class="fas fa-arrow-down ml-2"></i>
					</a>
				</div>
			</div>

			<!-- Hero Image -->
			<div class="flex justify-center lg:justify-end animate-slide-in-right">
				<div class="relative">
					<div class="relative z-10 animate-float">
						<img src="/img/internet-hero.png" alt="Internet Data Plans - Mobile Networks" class="w-full max-w-lg h-auto object-contain drop-shadow-2xl" />
					</div>

					<div class="absolute inset-0 bg-primary-400/20 rounded-full blur-3xl transform scale-150"></div>
					<div class="absolute top-10 right-10 w-20 h-20 bg-primary-400/30 rounded-full blur-xl animate-pulse-slow"></div>
					<div class="absolute bottom-10 left-10 w-16 h-16 bg-blue-400/30 rounded-full blur-xl animate-pulse-slow" style="animation-delay: 1.5s;"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Process Steps -->
<section class="py-16 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12 scroll-animation">
			<h2 class="text-3xl lg:text-4xl font-display font-bold text-navy-900 mb-4">How It Works</h2>
			<p class="text-lg text-gray-600">Get your internet data in 4 simple steps</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 scroll-animation">
			{#each [{ icon: 'fas fa-play', title: 'Get Started', desc: 'Choose your preferred data plan from our wide selection', step: 1 }, { icon: 'fas fa-check-circle', title: 'Select Plan', desc: 'Pick the data size and network that suits your needs', step: 2 }, { icon: 'fas fa-credit-card', title: 'Payment Info', desc: 'Enter your details and complete secure payment', step: 3 }, { icon: 'fas fa-rocket', title: 'Topup Sent', desc: 'Receive instant confirmation and enjoy your data', step: 4 }] as step}
				<div class="text-center group">
					<div class="relative mb-6">
						<div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary-200 transition-colors duration-200">
							<i class="{step.icon} text-primary-600 text-2xl"></i>
						</div>
						<div class="absolute -top-2 -right-2 w-8 h-8 bg-primary-400 text-white rounded-full flex items-center justify-center text-sm font-bold">{step.step}</div>
					</div>
					<h3 class="font-display font-bold text-lg text-navy-900 mb-2">{step.title}</h3>
					<p class="text-gray-600">{step.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Data Plans Section -->
<section id="plans" class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16 scroll-animation">
			<h2 class="text-4xl lg:text-5xl font-display font-black text-navy-900 mb-6 tracking-tight">
				Our <span class="text-primary-500">Data Plans</span>
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
				Choose from our comprehensive range of internet data plans. All plans include rollover benefits and 60-day validity.
			</p>
		</div>

		{#if data.bundles.length === 0}
			<!-- No bundles available -->
			<div class="text-center py-16">
				<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<i class="fas fa-wifi-slash text-gray-400 text-4xl"></i>
				</div>
				<h3 class="text-2xl font-display font-bold text-navy-900 mb-4">No Plans Available</h3>
				<p class="text-gray-600 max-w-md mx-auto">
					Data plans are currently being updated. Please check back soon or contact us for assistance.
				</p>
			</div>
		{:else}
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
									<div class="text-2xl font-bold text-navy-900">{bundle.bundleCapacity}</div>
								</div>
							</div>

							<div class="bg-gradient-to-r {getNetworkColor(bundle.offerCode)} text-white p-4 rounded-lg mb-6">
								<div class="grid grid-cols-3 gap-4 text-sm">
									<div>
										<div class="font-bold">GHS {parseFloat(bundle.finalPrice).toFixed(2)}</div>
										<div>Price</div>
									</div>
									<div>
										<div class="font-bold">Yes</div>
										<div>Rollover</div>
									</div>
									<div>
										<div class="font-bold">{bundle.bundleDuration}</div>
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
						class="px-8 py-3 bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
					>
						Load More Plans
					</button>
				</div>
			{/if}
		{/if}
	</div>
</section>

<!-- Checkout Modal -->
{#if showCheckout && selectedBundle}
	<CheckoutModal bundle={selectedBundle} customer={data.customer} onClose={closeCheckout} />
{/if}
