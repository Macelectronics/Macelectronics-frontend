<script lang="ts">
	import { onDestroy } from 'svelte';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import CheckCircleIcon from 'lucide-svelte/icons/check-circle';
	import XCircleIcon from 'lucide-svelte/icons/x-circle';
	import LoaderIcon from 'lucide-svelte/icons/loader-2';
	import RefreshCwIcon from 'lucide-svelte/icons/refresh-cw';
	import AlertCircleIcon from 'lucide-svelte/icons/alert-circle';
	import PhoneIcon from 'lucide-svelte/icons/phone';

	interface Props {
		reference: string;
		amount: string;
		bundleName: string;
		beneficiaryPhone: string;
		onSuccess: (orderId: string, orderNumber?: string) => void;
		onCancel: () => void;
		onError: (error: string) => void;
	}

	let {
		reference,
		amount,
		bundleName,
		beneficiaryPhone,
		onSuccess,
		onCancel,
		onError
	}: Props = $props();

	// Payment window: 10 minutes
	const PAYMENT_TIMEOUT_SECONDS = 600;
	const POLL_INTERVAL_MS = 5000; // Poll every 5 seconds

	type PaymentStatus = 'waiting' | 'polling' | 'verifying' | 'success' | 'failed' | 'timeout' | 'cancelled';

	let status = $state<PaymentStatus>('waiting');
	let timeRemaining = $state(PAYMENT_TIMEOUT_SECONDS);
	let pollCount = $state(0);
	let lastError = $state<string | null>(null);
	let completedOrderId = $state<string | null>(null);
	let completedOrderNumber = $state<string | null>(null);
	let isVerifying = $state(false);
	let countdownInterval: ReturnType<typeof setInterval> | null = null;
	let pollInterval: ReturnType<typeof setInterval> | null = null;

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function formatCurrency(value: string | number): string {
		const num = typeof value === 'string' ? parseFloat(value) : value;
		return new Intl.NumberFormat('en-GH', {
			style: 'currency',
			currency: 'GHS'
		}).format(num);
	}

	async function verifyPayment(): Promise<boolean> {
		status = 'verifying';
		isVerifying = true;
		pollCount++;

		try {
			const response = await fetch('/api/checkout/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ reference })
			});

			const result = await response.json();

			if (result.success && result.status === 'SUCCESS') {
				status = 'success';
				completedOrderId = result.orderId || null;
				completedOrderNumber = result.orderNumber || null;
				stopPolling();
				return true;
			}

			// Check for specific statuses
			if (result.status === 'PENDING') {
				status = 'waiting';
				lastError = null;
				return false;
			}

			if (result.status === 'FAILED') {
				status = 'failed';
				lastError = result.error || 'Payment failed';
				stopPolling();
				return false;
			}

			// Other cases - continue polling
			status = 'waiting';
			lastError = result.error || null;
			return false;
		} catch (error) {
			console.error('Verification error:', error);
			status = 'waiting';
			lastError = 'Network error during verification';
			return false;
		} finally {
			isVerifying = false;
		}
	}

	function startPolling() {
		// Clear any existing intervals
		stopPolling();

		// Start countdown
		countdownInterval = setInterval(() => {
			timeRemaining--;
			if (timeRemaining <= 0) {
				status = 'timeout';
				stopPolling();
			}
		}, 1000);

		// Start polling
		pollInterval = setInterval(async () => {
			if (status === 'waiting' || status === 'polling') {
				status = 'polling';
				await verifyPayment();
			}
		}, POLL_INTERVAL_MS);

		// Initial verification after 3 seconds (give user time to complete payment)
		setTimeout(() => {
			if (status === 'waiting') {
				verifyPayment();
			}
		}, 3000);
	}

	function stopPolling() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = null;
		}
		if (pollInterval) {
			clearInterval(pollInterval);
			pollInterval = null;
		}
	}

	function handleManualVerify() {
		if (status !== 'verifying') {
			verifyPayment();
		}
	}

	function handleSuccess() {
		stopPolling();
		onSuccess(completedOrderId || '', completedOrderNumber || undefined);
	}

	function handleCancel() {
		stopPolling();
		status = 'cancelled';
		onCancel();
	}

	function handleRetry() {
		status = 'waiting';
		lastError = null;
		timeRemaining = PAYMENT_TIMEOUT_SECONDS;
		pollCount = 0;
		startPolling();
	}

	// Start polling on mount
	$effect(() => {
		startPolling();
	});

	// Cleanup on destroy
	onDestroy(() => {
		stopPolling();
	});

	const progressPercentage = $derived((timeRemaining / PAYMENT_TIMEOUT_SECONDS) * 100);
	const isLowTime = $derived(timeRemaining < 120); // Less than 2 minutes
</script>

<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
	<div class="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
		<!-- Header -->
		<div class="bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
			<h2 class="text-lg font-bold text-white">Payment Verification</h2>
			<p class="text-sm text-white/70">Ref: {reference.slice(0, 20)}...</p>
		</div>

		<!-- Content -->
		<div class="p-6 space-y-6">
			<!-- Order Details -->
			<div class="bg-gray-50 rounded-xl p-4 space-y-2">
				<div class="flex justify-between">
					<span class="text-sm text-gray-500">Bundle</span>
					<span class="text-sm font-medium text-gray-900">{bundleName}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-sm text-gray-500">Amount</span>
					<span class="text-lg font-bold text-primary-600">{formatCurrency(amount)}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-sm text-gray-500">Recipient</span>
					<span class="text-sm font-medium text-gray-900">{beneficiaryPhone}</span>
				</div>
			</div>

			<!-- Status Display -->
			{#if status === 'waiting' || status === 'polling' || status === 'verifying'}
				<!-- Countdown Timer -->
				<div class="bg-gray-100 rounded-xl p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<ClockIcon class="w-5 h-5 {isLowTime ? 'text-red-500' : 'text-gray-600'}" />
							<span class="text-sm text-gray-700">Time Remaining</span>
						</div>
						<span class="text-xl font-mono font-bold {isLowTime ? 'text-red-500' : 'text-gray-900'}">
							{formatTime(timeRemaining)}
						</span>
					</div>
					<!-- Progress Bar -->
					<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
						<div
							class="h-full transition-all duration-1000 rounded-full {isLowTime ? 'bg-red-500' : 'bg-primary-500'}"
							style="width: {progressPercentage}%"
						></div>
					</div>
				</div>

				<!-- Status Message -->
				<div class="flex items-center justify-center gap-3 py-4">
					{#if status === 'verifying'}
						<LoaderIcon class="w-6 h-6 text-primary-500 animate-spin" />
						<span class="text-gray-700">Verifying payment...</span>
					{:else if status === 'polling'}
						<RefreshCwIcon class="w-5 h-5 text-primary-500 animate-spin" />
						<span class="text-gray-700">Checking status (attempt {pollCount})</span>
					{:else}
						<div class="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
						<span class="text-gray-700">Waiting for payment confirmation...</span>
					{/if}
				</div>

				<!-- Instructions -->
				<div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
					<p class="text-sm text-amber-800">
						Complete your payment in the Paystack window. This page will automatically update when your payment is confirmed.
					</p>
				</div>

				<!-- Error Display -->
				{#if lastError}
					<div class="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
						<AlertCircleIcon class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
						<p class="text-sm text-red-700">{lastError}</p>
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex gap-3">
					<button
						type="button"
						onclick={handleManualVerify}
						disabled={status === 'verifying'}
						class="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
					>
						{#if status === 'verifying'}
							<LoaderIcon class="w-4 h-4 animate-spin" />
							Verifying...
						{:else}
							<RefreshCwIcon class="w-4 h-4" />
							Verify Now
						{/if}
					</button>
					<button
						type="button"
						onclick={handleCancel}
						class="py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-all"
					>
						Cancel
					</button>
				</div>

			{:else if status === 'success'}
				<!-- Success State -->
				<div class="text-center py-6">
					<div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<CheckCircleIcon class="w-10 h-10 text-green-500" />
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
					<p class="text-gray-600 mb-4">Your data bundle will be delivered shortly.</p>
					{#if completedOrderNumber}
						<p class="text-sm text-gray-500">Order: <span class="font-mono font-medium">{completedOrderNumber}</span></p>
					{/if}
				</div>

				<div class="space-y-3">
					<button
						type="button"
						onclick={handleSuccess}
						class="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all"
					>
						Continue
					</button>
					<a
						href="/orders?phone={encodeURIComponent(beneficiaryPhone)}"
						class="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all text-center"
					>
						Track Your Orders
					</a>
				</div>

			{:else if status === 'failed'}
				<!-- Failed State -->
				<div class="text-center py-6">
					<div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<XCircleIcon class="w-10 h-10 text-red-500" />
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
					<p class="text-gray-600 mb-4">{lastError || 'The payment could not be completed.'}</p>
				</div>

				<div class="flex gap-3">
					<button
						type="button"
						onclick={handleRetry}
						class="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all"
					>
						Try Again
					</button>
					<button
						type="button"
						onclick={handleCancel}
						class="py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-all"
					>
						Close
					</button>
				</div>

			{:else if status === 'timeout'}
				<!-- Timeout State -->
				<div class="text-center py-6">
					<div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<ClockIcon class="w-10 h-10 text-amber-500" />
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-2">Payment Window Expired</h3>
					<p class="text-gray-600 mb-4">The payment time has expired. If you completed payment, click "Verify Payment" to check the status.</p>
				</div>

				<div class="space-y-3">
					<button
						type="button"
						onclick={handleManualVerify}
						disabled={isVerifying}
						class="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
					>
						{#if isVerifying}
							<LoaderIcon class="w-4 h-4 animate-spin" />
							Verifying...
						{:else}
							<RefreshCwIcon class="w-4 h-4" />
							Verify Payment
						{/if}
					</button>

					<div class="bg-gray-100 rounded-xl p-4">
						<div class="flex items-center gap-2 text-sm text-gray-700 mb-2">
							<PhoneIcon class="w-4 h-4 text-primary-500" />
							<span>If payment was deducted, contact support:</span>
						</div>
						<a href="tel:0557190318" class="text-primary-600 font-medium hover:underline">
							0557190318
						</a>
					</div>

					<button
						type="button"
						onclick={handleCancel}
						class="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-all"
					>
						Close
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
