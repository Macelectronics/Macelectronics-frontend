<script lang="ts">
	import type { StorefrontBundle, OrderInitResponse, Customer } from '$lib/types/bundle';
	import CheckoutPaymentVerification from './CheckoutPaymentVerification.svelte';

	interface Props {
		bundle: StorefrontBundle;
		customer: Customer | null;
		onClose: () => void;
		onOrderSuccess?: () => void;
	}

	let { bundle, customer, onClose, onOrderSuccess }: Props = $props();

	// Form state
	let beneficiaryPhone = $state('');
	let customerPhone = $state(customer?.phoneNumber || '');
	let customerEmail = $state(customer?.email || '');
	let customerName = $state(customer ? `${customer.firstName} ${customer.lastName}`.trim() : '');
	let paymentMethod = $state<'wallet' | 'paystack'>(customer ? 'wallet' : 'paystack');

	// UI state
	let step = $state<'form' | 'processing' | 'success' | 'error'>('form');
	let errorMessage = $state('');
	let successMessage = $state('');
	let orderId = $state('');
	let orderNumber = $state('');
	let isLoading = $state(false);

	// Paystack inline popup state
	let payStackPop: any = $state(null);
	let showPaymentVerification = $state(false);
	let pendingPayment = $state<{
		reference: string;
		amount: string;
	} | null>(null);

	// Validation
	let phoneError = $state('');

	// Calculate wallet balance check
	let walletBalance = $derived(customer?.walletBalance ? parseFloat(customer.walletBalance) : 0);
	let bundlePrice = $derived(parseFloat(bundle.finalPrice));
	let hasInsufficientBalance = $derived(walletBalance < bundlePrice);

	// Load Paystack inline JS
	$effect(() => {
		(async () => {
			try {
				const paystack = await import('@paystack/inline-js');
				payStackPop = new paystack.default();
			} catch (error) {
				console.error('Failed to load Paystack:', error);
			}
		})();
	});

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
			// For logged in customers using wallet payment
			if (customer && paymentMethod === 'wallet') {
				const response = await fetch('/api/order/wallet', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						storefrontBundleId: bundle.id,
						beneficiaryPhone
					})
				});

				const result = await response.json();

				if (!result.success) {
					step = 'error';
					errorMessage = result.error || 'Failed to process order';
					return;
				}

				// Success!
				step = 'success';
				orderId = result.orderId || '';
				orderNumber = result.orderNumber || '';
				successMessage = result.message || 'Order placed successfully!';
				onOrderSuccess?.();
				return;
			}

			// For guest or Paystack payment
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

			// Use inline popup if access code is available
			if (result.accessCode && payStackPop) {
				pendingPayment = {
					reference: result.reference || '',
					amount: bundle.finalPrice
				};

				try {
					payStackPop.resumeTransaction(result.accessCode, {
						onSuccess: () => {
							showPaymentVerification = true;
						},
						onCancel: () => {
							// User cancelled - still show verification in case they completed
							showPaymentVerification = true;
						},
						onError: () => {
							// Error occurred - still show verification in case payment went through
							showPaymentVerification = true;
						}
					});

					// Show verification modal after a short delay
					// This ensures the user sees the polling even if callbacks don't fire
					setTimeout(() => {
						if (pendingPayment && !showPaymentVerification) {
							showPaymentVerification = true;
						}
					}, 2000);
				} catch (error) {
					console.error('Paystack popup error:', error);
					// Fall back to redirect
					if (result.authorizationUrl) {
						window.location.href = result.authorizationUrl;
					}
				}
			} else if (result.authorizationUrl) {
				// Fall back to redirect if no access code
				window.location.href = result.authorizationUrl;
			}
		} catch (error) {
			step = 'error';
			errorMessage = 'Network error. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handlePaymentSuccess(completedOrderId: string, completedOrderNumber?: string) {
		showPaymentVerification = false;
		pendingPayment = null;
		step = 'success';
		orderId = completedOrderId;
		orderNumber = completedOrderNumber || '';
		successMessage = 'Order placed successfully! Your data bundle will be delivered shortly.';
		onOrderSuccess?.();
	}

	function handlePaymentCancel() {
		showPaymentVerification = false;
		pendingPayment = null;
		step = 'error';
		errorMessage = 'Payment was cancelled or could not be verified.';
	}

	function handlePaymentError(error: string) {
		showPaymentVerification = false;
		pendingPayment = null;
		step = 'error';
		errorMessage = error;
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget && (step === 'form' || step === 'success')) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && (step === 'form' || step === 'success')) {
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

	let isFormValid = $derived(
		validatePhone(beneficiaryPhone) &&
		(paymentMethod === 'paystack' || !hasInsufficientBalance)
	);
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

				{#if !customer}
					<!-- Customer Phone (Optional) - Only for guests -->
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
				{:else}
					<!-- Logged in customer info -->
					<div class="bg-gray-50 rounded-lg p-4">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
								<i class="fas fa-user text-primary-600"></i>
							</div>
							<div>
								<p class="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
								<p class="text-sm text-gray-500">{customer.phoneNumber}</p>
							</div>
						</div>
					</div>

					<!-- Payment Method Selection -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
						<div class="grid grid-cols-2 gap-3">
							<button
								type="button"
								onclick={() => paymentMethod = 'wallet'}
								class="p-4 border-2 rounded-lg transition-all {paymentMethod === 'wallet' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
							>
								<div class="flex flex-col items-center gap-2">
									<i class="fas fa-wallet text-2xl {paymentMethod === 'wallet' ? 'text-primary-600' : 'text-gray-400'}"></i>
									<span class="text-sm font-medium {paymentMethod === 'wallet' ? 'text-primary-600' : 'text-gray-600'}">Wallet</span>
									<span class="text-xs {paymentMethod === 'wallet' ? 'text-primary-500' : 'text-gray-400'}">
										GHS {walletBalance.toFixed(2)}
									</span>
								</div>
							</button>
							<button
								type="button"
								onclick={() => paymentMethod = 'paystack'}
								class="p-4 border-2 rounded-lg transition-all {paymentMethod === 'paystack' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}"
							>
								<div class="flex flex-col items-center gap-2">
									<i class="fas fa-credit-card text-2xl {paymentMethod === 'paystack' ? 'text-primary-600' : 'text-gray-400'}"></i>
									<span class="text-sm font-medium {paymentMethod === 'paystack' ? 'text-primary-600' : 'text-gray-600'}">Card/MoMo</span>
									<span class="text-xs {paymentMethod === 'paystack' ? 'text-primary-500' : 'text-gray-400'}">Paystack</span>
								</div>
							</button>
						</div>

						{#if paymentMethod === 'wallet' && hasInsufficientBalance}
							<div class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
								<div class="flex items-start gap-2">
									<i class="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
									<div>
										<p class="text-sm text-red-700 font-medium">Insufficient balance</p>
										<p class="text-xs text-red-600">
											You need GHS {(bundlePrice - walletBalance).toFixed(2)} more.
											<a href="/dashboard/wallet" class="underline hover:no-underline">Top up your wallet</a>
										</p>
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Payment Notice -->
				{#if !customer || paymentMethod === 'paystack'}
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div class="flex items-start">
							<i class="fas fa-shield-alt text-blue-500 mt-0.5 mr-3"></i>
							<div>
								<p class="text-sm text-blue-800 font-medium">Secure Payment</p>
								<p class="text-xs text-blue-600 mt-1">Payment will be processed securely via Paystack. You'll stay on this page during payment.</p>
							</div>
						</div>
					</div>
				{:else}
					<div class="bg-green-50 border border-green-200 rounded-lg p-4">
						<div class="flex items-start">
							<i class="fas fa-bolt text-green-500 mt-0.5 mr-3"></i>
							<div>
								<p class="text-sm text-green-800 font-medium">Instant Payment</p>
								<p class="text-xs text-green-600 mt-1">Payment will be deducted from your wallet balance instantly.</p>
							</div>
						</div>
					</div>
				{/if}

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
				<p class="text-gray-600">
					{#if paymentMethod === 'wallet'}
						Processing your order...
					{:else}
						Initializing payment...
					{/if}
				</p>
			</div>
		{:else if step === 'success'}
			<!-- Success State -->
			<div class="p-8 text-center">
				<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<i class="fas fa-check text-green-600 text-2xl"></i>
				</div>
				<h3 class="text-xl font-display font-bold text-navy-900 mb-2">Order Placed!</h3>
				<p class="text-gray-600 mb-2">{successMessage}</p>
				{#if orderNumber}
					<p class="text-sm text-gray-500">Order number: <span class="font-mono font-medium">{orderNumber}</span></p>
				{/if}
				<div class="mt-6 flex gap-4 justify-center">
					{#if customer}
						<a
							href="/dashboard/orders"
							class="px-6 py-2 bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold rounded-lg transition-colors"
						>
							View Orders
						</a>
					{/if}
					<button onclick={onClose} class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors">
						Close
					</button>
				</div>
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

<!-- Payment Verification Modal -->
{#if showPaymentVerification && pendingPayment}
	<CheckoutPaymentVerification
		reference={pendingPayment.reference}
		amount={pendingPayment.amount}
		bundleName={bundle.bundleCapacity}
		beneficiaryPhone={beneficiaryPhone}
		onSuccess={handlePaymentSuccess}
		onCancel={handlePaymentCancel}
		onError={handlePaymentError}
	/>
{/if}
