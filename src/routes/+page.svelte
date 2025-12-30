<script lang="ts">
	import { useScrollAnimation } from '$lib/stores/scrollAnimation';
	import FAQ from '$lib/components/FAQ.svelte';

	// Use scroll animation hook
	useScrollAnimation();

	function scrollToSection(sectionId: string) {
		const element = document.querySelector(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<svelte:head>
	<title>Macelectronics - Ghana's Premier Mobile Top-Up & Digital Services Platform</title>
	<meta name="description" content="Macelectronics - Ghana's leading digital platform for mobile recharge, data bundles, utility bill payments, and digital services. Fast, secure, and reliable." />
	<meta name="keywords" content="Ghana mobile recharge, data bundles, utility bills, AirtelTiGO, MTN, Vodafone, mobile top up, digital services, Ghana" />
</svelte:head>

<!-- Hero Section -->
<section class="gradient-bg relative overflow-hidden lg:pt-4">
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
				<h1 class="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white leading-[1.1] mb-8 tracking-tight">
					Fastest and safest way to send
					<span class="text-primary-400 bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">mobile top-up</span>
					in Ghana.
				</h1>

				<p class="text-xl text-gray-300 mb-8 leading-relaxed">
					Macelectronics Ghana makes gifting simple and swift. Quickly recharge mobile data, call credit, and pay utility bills in just a few clicks.
				</p>

				<!-- Features -->
				<div class="space-y-4 mb-10">
					<div class="flex items-center text-left animate-slide-in-left" style="animation-delay: 0.2s;">
						<div class="w-2 h-2 bg-primary-400 rounded-full mr-4"></div>
						<span class="text-lg text-gray-200">It's easy to keep track of payments.</span>
					</div>
					<div class="flex items-center text-left animate-slide-in-left" style="animation-delay: 0.4s;">
						<div class="w-2 h-2 bg-primary-400 rounded-full mr-4"></div>
						<span class="text-lg text-gray-200">It's convenient and saves time.</span>
					</div>
					<div class="flex items-center text-left animate-slide-in-left" style="animation-delay: 0.6s;">
						<div class="w-2 h-2 bg-primary-400 rounded-full mr-4"></div>
						<span class="text-lg text-gray-200">It's secure and hassle-free.</span>
					</div>
				</div>

				<!-- CTA Button -->
				<div class="animate-scale-in" style="animation-delay: 0.8s;">
					<button
						onclick={() => scrollToSection('#services')}
						class="inline-flex items-center bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
					>
						Get Started Now
						<i class="fas fa-arrow-right ml-2"></i>
					</button>
				</div>
			</div>

			<!-- Hero Image -->
			<div class="flex justify-center lg:justify-end animate-slide-in-right">
				<div class="relative">
					<div class="relative z-10 animate-float">
						<img src="/img/MacData_Gh.png" alt="E-TopUp GH Mobile App Interface" class="w-full max-w-lg h-auto object-contain drop-shadow-2xl" />
					</div>

					<div class="absolute inset-0 bg-primary-400/20 rounded-full blur-3xl transform scale-150"></div>
					<div class="absolute top-10 right-10 w-20 h-20 bg-primary-400/30 rounded-full blur-xl animate-pulse-slow"></div>
					<div class="absolute bottom-10 left-10 w-16 h-16 bg-blue-400/30 rounded-full blur-xl animate-pulse-slow" style="animation-delay: 1.5s;"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Featured Partners -->
<section class="py-20 gradient-bg relative overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-br from-navy-900/95 to-navy-800/95"></div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16 scroll-animation">
			<h2 class="text-4xl lg:text-5xl font-display font-black text-white mb-6 tracking-tight">
				Trusted <span class="text-primary-500">Partners</span>
			</h2>
			<p class="text-xl text-gray-300 max-w-3xl mx-auto font-light">
				Empowering millions across Ghana through strategic partnerships with leading telecommunication and entertainment providers
			</p>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 scroll-animation">
			<!-- Network Partners -->
			{#each [{ name: 'AirtelTiGO', img: '/img/at.png', color: 'from-red-500 to-red-600' }, { name: 'MTN', img: '/img/mtn.png', color: 'from-yellow-500 to-yellow-600' }, { name: 'Vodafone', img: '/img/voda.png', color: 'from-red-600 to-red-700' }, { name: 'DStv', icon: 'fas fa-satellite-dish', color: 'from-blue-600 to-blue-800' }, { name: 'StarTimes', icon: 'fas fa-tv', color: 'from-green-600 to-green-700' }] as partner}
				<div class="group relative">
					<div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
						<div class="flex flex-col items-center justify-center space-y-4">
							<div class="w-16 h-16 bg-gradient-to-br {partner.color} rounded-xl flex items-center justify-center shadow-lg">
								{#if partner.img}
									<img src={partner.img} alt={partner.name} class="w-full h-full object-contain" />
								{:else}
									<i class="{partner.icon} text-white text-2xl"></i>
								{/if}
							</div>
							<span class="text-white font-display font-bold text-lg group-hover:text-primary-300 transition-colors">{partner.name}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Stats Section -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 scroll-animation">
			<div class="text-center">
				<div class="text-4xl font-display font-black text-primary-400 mb-2">99%</div>
				<div class="text-white font-medium">Success Rate</div>
			</div>
			<div class="text-center">
				<div class="text-4xl font-display font-black text-primary-400 mb-2">3s</div>
				<div class="text-white font-medium">Average Delivery</div>
			</div>
			<div class="text-center">
				<div class="text-4xl font-display font-black text-primary-400 mb-2">24/7</div>
				<div class="text-white font-medium">Support Available</div>
			</div>
		</div>
	</div>
</section>

<!-- Services Section -->
<section id="services" class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-20 scroll-animation">
			<h2 class="text-5xl lg:text-6xl font-display font-black text-navy-900 mb-8 tracking-tight">
				Explore our <span class="text-primary-500">services</span>
			</h2>
			<p class="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
				You're just one step closer to experiencing a digital transformation for your home, business, or personal life.
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each [{ name: 'Internet', icon: 'fas fa-wifi', desc: 'Fast and reliable internet data packages for all networks', href: '/internet' }, { name: 'Airtime', icon: 'fas fa-mobile-alt', desc: 'Instant mobile airtime top-up for all major networks', href: null }, { name: 'Electricity', icon: 'fas fa-bolt', desc: 'Pay your electricity bills quickly and securely', href: null }, { name: 'Water', icon: 'fas fa-tint', desc: 'Convenient water bill payments from anywhere', href: null }, { name: 'DStv', icon: 'fas fa-satellite-dish', desc: 'Renew your DStv subscription with ease', href: null }, { name: 'StarTimes', icon: 'fas fa-tv', desc: 'Quick StarTimes subscription renewals', href: null }] as service}
				{#if service.href}
					<a href={service.href} class="service-card bg-navy-800 p-8 rounded-2xl text-white group scroll-animation cursor-pointer block">
						<div class="flex items-center justify-between mb-6">
							<div class="bg-primary-400/20 p-4 rounded-xl group-hover:bg-primary-400/30 transition-colors duration-200">
								<i class="{service.icon} text-3xl text-primary-400"></i>
							</div>
							<i class="fas fa-arrow-right text-xl opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-200"></i>
						</div>
						<h3 class="text-2xl font-display font-bold mb-4">{service.name}</h3>
						<p class="text-gray-300">{service.desc}</p>
					</a>
				{:else}
					<div class="service-card bg-navy-800 p-8 rounded-2xl text-white group scroll-animation cursor-not-allowed opacity-75">
						<div class="flex items-center justify-between mb-6">
							<div class="bg-primary-400/20 p-4 rounded-xl">
								<i class="{service.icon} text-3xl text-primary-400"></i>
							</div>
							<span class="text-xs bg-primary-400/20 text-primary-300 px-2 py-1 rounded-full">Coming Soon</span>
						</div>
						<h3 class="text-2xl font-display font-bold mb-4">{service.name}</h3>
						<p class="text-gray-300">{service.desc}</p>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- Popular Plans Section -->
<section id="popular-plans" class="py-20 bg-gradient-to-r from-navy-900 to-navy-800">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-20 scroll-animation">
			<h2 class="text-5xl lg:text-6xl font-display font-black text-white mb-8 tracking-tight">
				Our Popular <span class="text-primary-400">Plans</span>
			</h2>
			<p class="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">Enjoy the most popular data plans that suit your usage and budget. Get more for less.</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each [{ size: '1 GB', price: '4.00', popular: false }, { size: '10 GB', price: '35.00', popular: true }, { size: '100 GB', price: '290.00', popular: false }] as plan}
				<div class="plan-card bg-white rounded-2xl p-8 shadow-xl scroll-animation {plan.popular ? 'transform lg:scale-105 border-2 border-primary-400 relative' : ''}">
					{#if plan.popular}
						<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
							<span class="bg-primary-400 text-navy-900 px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
						</div>
					{/if}
					<div class="text-center">
						<div class="text-primary-600 text-sm font-semibold mb-2">AirtelTiGO</div>
						<div class="text-4xl font-bold text-navy-900 mb-4">{plan.size}</div>

						<div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg mb-6">
							<div class="grid grid-cols-3 gap-4 text-sm">
								<div>
									<div class="font-bold">GHS {plan.price}</div>
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

						<a href="/internet" class="w-full inline-block bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
							Select Plan
						</a>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-12 scroll-animation">
			<a href="/internet" class="inline-flex items-center text-primary-300 hover:text-primary-200 font-semibold transition-colors duration-200">
				View all plans
				<i class="fas fa-arrow-right ml-2"></i>
			</a>
		</div>
	</div>
</section>

<!-- Why Us Section -->
<section class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-20 scroll-animation">
			<h2 class="text-5xl lg:text-6xl font-display font-black text-navy-900 mb-8 tracking-tight">
				Why <span class="text-primary-500">Choose Us?</span>
			</h2>
			<p class="text-xl lg:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-light">
				Macelectronics is the perfect choice for fulfilling all your mobile data, call credit, and utility bill payment needs.
			</p>
		</div>

		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<div class="space-y-8">
				{#each [{ icon: 'fas fa-rocket', title: 'Fast and reliable', desc: '99% of mobile topups sent online with Macelectronics arrive in 3 seconds.' }, { icon: 'fas fa-credit-card', title: 'Easy payment & transaction history', desc: 'We provide easy payment process and keep track of your transaction history with utmost clarity.' }, { icon: 'fas fa-shield-alt', title: 'Secure and hassle-free', desc: 'Macelectronics ensures the protection of both personal and financial information.' }] as feature}
					<div class="flex items-start space-x-4 scroll-animation">
						<div class="bg-navy-100 p-4 rounded-xl flex-shrink-0">
							<i class="{feature.icon} text-2xl text-navy-800"></i>
						</div>
						<div>
							<h3 class="text-2xl font-display font-bold text-navy-900 mb-2">{feature.title}</h3>
							<p class="text-gray-600 text-lg">{feature.desc}</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="flex justify-center lg:justify-end animate-slide-in-right">
				<div class="relative">
					<div class="relative z-10">
						<img src="/img/why-us.png" alt="Why Choose Us" class="w-full max-w-md h-auto object-contain drop-shadow-2xl" />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<FAQ />
