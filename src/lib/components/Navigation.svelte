<script lang="ts">
	import { page } from '$app/stores';
	import type { Customer } from '$lib/types/bundle';
	import UserIcon from 'lucide-svelte/icons/user';

	interface Props {
		onComingSoon?: (serviceName: string) => void;
		customer?: Customer | null;
	}

	let { onComingSoon, customer }: Props = $props();

	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function showComingSoonPopup(serviceName: string) {
		onComingSoon?.(serviceName);
	}

	let currentPath = $derived($page.url.pathname);
</script>

<nav class="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 shadow-lg fixed w-full top-0 left-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16 lg:h-20">
			<!-- Logo -->
			<div class="flex-shrink-0 animate-fade-in">
				<a href="/" class="flex items-center">
					<div class="bg-primary-400 p-2 rounded-lg mr-3">
						<div class="w-6 h-6 bg-white rounded flex items-center justify-center">
							<i class="fas fa-mobile-alt text-primary-600 text-sm"></i>
						</div>
					</div>
					<span class="text-white font-display font-bold text-xl lg:text-2xl tracking-wide">MACELECTRONICS</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden lg:block animate-fade-in-down">
				<div class="ml-10 flex items-baseline space-x-8">
					<a
						href="/"
						class="px-3 py-2 text-sm font-medium transition-colors duration-200 {currentPath === '/' ? 'text-white border-b-2 border-primary-400' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-primary-400'}"
					>
						Home
					</a>
					<a
						href="/internet"
						class="px-3 py-2 text-sm font-medium transition-colors duration-200 {currentPath === '/internet' ? 'text-white border-b-2 border-primary-400' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-primary-400'}"
					>
						Internet
					</a>
					<button
						onclick={() => showComingSoonPopup('TV Services')}
						class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-primary-400"
					>
						TV
					</button>
					<button
						onclick={() => showComingSoonPopup('Utility Bills')}
						class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-primary-400"
					>
						Utility Bills
					</button>
					<button
						onclick={() => showComingSoonPopup('Mobile Airtime')}
						class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-primary-400"
					>
						Mobile Airtime
					</button>
				</div>
			</div>

			<!-- Login/Dashboard Button -->
			<div class="hidden lg:block animate-fade-in">
				{#if customer}
					<a
						href="/dashboard"
						class="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
					>
						<UserIcon class="w-4 h-4" />
						Dashboard
					</a>
				{:else}
					<a
						href="/login"
						class="bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
					>
						LOGIN
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="lg:hidden">
				<button onclick={toggleMobileMenu} class="hamburger text-white p-2 {mobileMenuOpen ? 'hamburger-active' : ''}">
					<div class="w-6 h-0.5 bg-white hamburger-line line1 mb-1"></div>
					<div class="w-6 h-0.5 bg-white hamburger-line line2 mb-1"></div>
					<div class="w-6 h-0.5 bg-white hamburger-line line3"></div>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	<div
		class="mobile-menu lg:hidden fixed inset-0 bg-navy-900 bg-opacity-95 backdrop-blur-lg transform {mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} z-40 overflow-y-auto"
	>
		<!-- Close button -->
		<div class="absolute top-6 right-6">
			<button onclick={closeMobileMenu} class="text-white p-2 hover:bg-white/10 rounded-full transition-colors duration-200">
				<i class="fas fa-times text-2xl"></i>
			</button>
		</div>

		<div class="flex flex-col h-full justify-center items-center space-y-8">
			<a
				href="/"
				onclick={closeMobileMenu}
				class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110 {currentPath === '/' ? 'text-primary-300' : ''}"
			>
				Home
			</a>
			<a
				href="/internet"
				onclick={closeMobileMenu}
				class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110 {currentPath === '/internet' ? 'text-primary-300' : ''}"
			>
				Internet
			</a>
			<button
				onclick={() => {
					showComingSoonPopup('TV Services');
					closeMobileMenu();
				}}
				class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110"
			>
				TV
			</button>
			<button
				onclick={() => {
					showComingSoonPopup('Utility Bills');
					closeMobileMenu();
				}}
				class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110"
			>
				Utility Bills
			</button>
			<button
				onclick={() => {
					showComingSoonPopup('Mobile Airtime');
					closeMobileMenu();
				}}
				class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110"
			>
				Mobile Airtime
			</button>
			{#if customer}
				<a
					href="/dashboard"
					onclick={closeMobileMenu}
					class="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-navy-900 font-display font-bold py-4 px-10 rounded-xl transition-all duration-200 transform hover:scale-105 text-xl shadow-lg hover:shadow-xl tracking-wide"
				>
					<UserIcon class="w-5 h-5" />
					Dashboard
				</a>
			{:else}
				<a
					href="/login"
					onclick={closeMobileMenu}
					class="bg-primary-400 hover:bg-primary-500 text-navy-900 font-display font-bold py-4 px-10 rounded-xl transition-all duration-200 transform hover:scale-105 text-xl shadow-lg hover:shadow-xl tracking-wide"
				>
					LOGIN
				</a>
			{/if}
		</div>
	</div>
</nav>
