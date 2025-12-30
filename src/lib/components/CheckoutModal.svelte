<script lang="ts">
	import type { StorefrontBundle, OrderInitResponse } from '$lib/types/bundle';

	interface Props {
		bundle: StorefrontBundle;
		onClose: () => void;
	}

	let { bundle, onClose }: Props = $props();

	// Form state
	let beneficiaryPhone = $state('');
	let customerPhone = $state('');
	let customerEmail = $state('');
	let customerName = $state('');

	// UI state
	let step = $state<'form' | 'processing' | 'success' | 'error'>('form');
	let errorMessage = $state('');
	let orderId = $state('');
	let isLoading = $state(false);

	// Validation
	let phoneError = $state('');

	function validatePhone(phone: string): boolean {
		// Ghana phone number validation (10 digits starting with 0)
		const regex = /^0[235][0-9]{8}$/;
		return regex.test(phone);
	}

	function handleBeneficiaryInput(e: Event) {
		const target = e.target as HTMLInputElement;
		beneficiaryPhone = target.value.replace(/\D/g, '').slice(0, 10);

		if (beneficiaryPhone.length === 10 && !validatePhone(beneficiaryPhone)) {
			phoneError = 'Please enter a valid Ghana phone number';
		} else {
			phoneError = '';
		}
	}

	function handleCustomerPhoneInput(e: Event) {
		const target = e.target as HTMLInputElement;
		customerPhone = target.value.replace(/\D/g, '').slice(0, 10);
	}

	async function handleSubmit() {
		// Validate beneficiary phone
		if (!validatePhone(beneficiaryPhone)) {
			phoneError = 'Please enter a valid Ghana phone number (e.g., 0241234567)';
			return;
		}

		// Use beneficiary phone as customer phone if not provided
		const finalCustomerPhone = customerPhone || beneficiaryPhone;

		if (!validatePhone(finalCustomerPhone)) {
			errorMessage = 'Please enter a valid customer phone number';
			return;
		}

		isLoading = true;
		step = 'processing';

		try {
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					storefrontBundleId: bundle.id,
					beneficiaryPhone,
					customerPhone: finalCustomerPhone,
					customerEmail: customerEmail || undefined,
					customerName: customerName || undefined
				})
			});

			const result: OrderInitResponse = await response.json();

			if (!result.success) {
				step = 'error';
				errorMessage = result.error || 'Failed to initialize payment';
				return;
			}

			// Store order ID for confirmation
			orderId = result.orderId || '';

			// Redirect to Paystack
			if (result.authorizationUrl) {
				window.location.href = result.authorizationUrl;
			}
		} catch (error) {
			step = 'error';
			errorMessage = 'Network error. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget && step === 'form') {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && step === 'form') {
			onClose();
		}
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

	let isFormValid = $derived(validatePhone(beneficiaryPhone));
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
	onclick={handleOverlayClick}
	onkeydown={handleKeydown}
	role="dialog"
	aria-modal="true"
	aria-labelledby="checkout-title"
	tabindex="-1"
>
	<div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
		{#if step === 'form'}
			<!-- Header -->
			<div class="bg-gradient-to-r from-navy-900 to-navy-800 p-6 rounded-t-2xl">
				<div class="flex items-center justify-between">
					<h2 id="checkout-title" class="text-xl font-display font-bold text-white">Complete Your Purchase</h2>
					<button onclick={onClose} class="text-white/70 hover:text-white transition-colors">
						<i class="fas fa-times text-xl"></i>
					</button>
				</div>
			</div>

			<!-- Bundle Summary -->
			<div class="p-6 border-b border-gray-100">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-sm text-gray-500">{getNetworkName(bundle.offerName)}</div>
						<div class="text-2xl font-bold text-navy-900">{bundle.bundleCapacity}</div>
						<div class="text-sm text-gray-500">{bundle.bundleDuration} validity</div>
					</div>
					<div class="text-right">
						<div class="text-3xl font-bold text-primary-500">GHS {parseFloat(bundle.finalPrice).toFixed(2)}</div>
					</div>
				</div>
			</div>

			<!-- Form -->
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="p-6 space-y-4">
				<!-- Beneficiary Phone -->
				<div>
					<label for="beneficiaryPhone" class="block text-sm font-medium text-gray-700 mb-1">
						Recipient Phone Number <span class="text-red-500">*</span>
					</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<i class="fas fa-phone"></i>
						</span>
						<input
							type="tel"
							id="beneficiaryPhone"
							value={beneficiaryPhone}
							oninput={handleBeneficiaryInput}
							placeholder="0241234567"
							class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
							required
						/>
					</div>
					{#if phoneError}
						<p class="mt-1 text-sm text-red-500">{phoneError}</p>
					{/if}
					<p class="mt-1 text-xs text-gray-500">This is the phone number that will receive the data</p>
				</div>

				<!-- Customer Phone (Optional) -->
				<div>
					<label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-1">Your Phone Number</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<i class="fas fa-mobile-alt"></i>
						</span>
						<input
							type="tel"
							id="customerPhone"
							value={customerPhone}
							oninput={handleCustomerPhoneInput}
							placeholder="Same as recipient (optional)"
							class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
						/>
					</div>
					<p class="mt-1 text-xs text-gray-500">Leave blank if same as recipient</p>
				</div>

				<!-- Customer Email (Optional) -->
				<div>
					<label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<i class="fas fa-envelope"></i>
						</span>
						<input
							type="email"
							id="customerEmail"
							bind:value={customerEmail}
							placeholder="email@example.com (optional)"
							class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
						/>
					</div>
					<p class="mt-1 text-xs text-gray-500">For order confirmation receipt</p>
				</div>

				<!-- Customer Name (Optional) -->
				<div>
					<label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<i class="fas fa-user"></i>
						</span>
						<input
							type="text"
							id="customerName"
							bind:value={customerName}
							placeholder="John Doe (optional)"
							class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
						/>
					</div>
				</div>

				<!-- Payment Notice -->
				<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div class="flex items-start">
						<i class="fas fa-shield-alt text-blue-500 mt-0.5 mr-3"></i>
						<div>
							<p class="text-sm text-blue-800 font-medium">Secure Payment</p>
							<p class="text-xs text-blue-600 mt-1">You will be redirected to Paystack to complete your payment securely.</p>
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={!isFormValid || isLoading}
					class="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-navy-900 font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
				>
					{#if isLoading}
						<i class="fas fa-spinner fa-spin mr-2"></i>
						Processing...
					{:else}
						Pay GHS {parseFloat(bundle.finalPrice).toFixed(2)}
					{/if}
				</button>
			</form>
		{:else if step === 'processing'}
			<!-- Processing State -->
			<div class="p-8 text-center">
				<div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<i class="fas fa-spinner fa-spin text-primary-600 text-2xl"></i>
				</div>
				<h3 class="text-xl font-display font-bold text-navy-900 mb-2">Processing Payment</h3>
				<p class="text-gray-600">Please wait while we redirect you to the payment page...</p>
			</div>
		{:else if step === 'error'}
			<!-- Error State -->
			<div class="p-8 text-center">
				<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
				</div>
				<h3 class="text-xl font-display font-bold text-navy-900 mb-2">Payment Failed</h3>
				<p class="text-gray-600 mb-6">{errorMessage}</p>
				<div class="flex gap-4 justify-center">
					<button
						onclick={() => {
							step = 'form';
							errorMessage = '';
						}}
						class="px-6 py-2 bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold rounded-lg transition-colors"
					>
						Try Again
					</button>
					<button onclick={onClose} class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"> Cancel </button>
				</div>
			</div>
		{/if}
	</div>
</div>
