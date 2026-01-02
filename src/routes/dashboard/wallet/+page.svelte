<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll, goto } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	import WalletIcon from 'lucide-svelte/icons/wallet';
	import CreditCardIcon from 'lucide-svelte/icons/credit-card';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
	import LoaderIcon from 'lucide-svelte/icons/loader-2';
	import CheckCircleIcon from 'lucide-svelte/icons/check-circle';
	import AlertCircleIcon from 'lucide-svelte/icons/alert-circle';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let amount = $state('');
	let isProcessing = $state(false);
	let payStackPop: any = $state(null);
	let currentTopupId = $state<string | null>(null);
	let successMessage = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);

	const MIN_AMOUNT = 10;
	const MAX_AMOUNT = 10000;

	function formatCurrency(value: string | number): string {
		const num = typeof value === 'string' ? parseFloat(value) : value;
		return new Intl.NumberFormat('en-GH', {
			style: 'currency',
			currency: 'GHS'
		}).format(num);
	}

	$effect(() => {
		// Load Paystack inline JS
		(async () => {
			try {
				const paystack = await import('@paystack/inline-js');
				payStackPop = new paystack.default();
			} catch (error) {
				console.error('Failed to load Paystack:', error);
				errorMessage = 'Could not load payment system. Please refresh the page.';
			}
		})();
	});

	const amountValue = $derived(parseFloat(amount) || 0);
	const isValidAmount = $derived(amountValue >= MIN_AMOUNT && amountValue <= MAX_AMOUNT);

	async function handlePaystackSuccess(topupId: string) {
		isProcessing = true;
		errorMessage = null;

		// Call verify action
		const formData = new FormData();
		formData.append('topupId', topupId);

		try {
			const response = await fetch('?/verify', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.type === 'success' && result.data?.success) {
				successMessage = `Payment successful! Your new balance is ${formatCurrency(result.data.newBalance || '0')}`;
				amount = '';
				// Refresh data to get updated balance
				await invalidateAll();
			} else {
				errorMessage = result.data?.error || 'Failed to verify payment. Please contact support.';
			}
		} catch (error) {
			console.error('Verify error:', error);
			errorMessage = 'An error occurred while verifying payment. Please contact support.';
		} finally {
			isProcessing = false;
			currentTopupId = null;
		}
	}

	function handlePaystackCancel() {
		isProcessing = false;
		currentTopupId = null;
		errorMessage = 'Payment was cancelled.';
	}

	function handlePaystackError() {
		isProcessing = false;
		currentTopupId = null;
		errorMessage = 'Payment failed. Please try again.';
	}

	const handleSubmit: SubmitFunction = ({ formData }) => {
		isProcessing = true;
		errorMessage = null;
		successMessage = null;
		formData.append('amount', amount);

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.success) {
				const { accessCode, topupId } = result.data;
				currentTopupId = topupId;

				if (!payStackPop) {
					errorMessage = 'Payment system not ready. Please refresh the page.';
					isProcessing = false;
					return;
				}

				try {
					payStackPop.resumeTransaction(accessCode, {
						onSuccess: () => handlePaystackSuccess(topupId),
						onCancel: handlePaystackCancel,
						onError: handlePaystackError
					});
				} catch (error) {
					console.error('Paystack error:', error);
					errorMessage = 'Failed to open payment window.';
					isProcessing = false;
				}
			} else {
				await update();
				isProcessing = false;
			}
		};
	};

	// Preset amounts
	const presetAmounts = [20, 50, 100, 200, 500];
</script>

<svelte:head>
	<title>Wallet Topup - Macelectronics</title>
	<meta name="description" content="Top up your Macelectronics wallet to purchase data bundles." />
</svelte:head>

<section class="min-h-screen gradient-bg relative overflow-hidden py-8">
	<div class="absolute inset-0 bg-gradient-to-br from-navy-900/95 to-navy-800/95"></div>

	<!-- Background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/5 rounded-full blur-3xl"></div>
		<div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/5 rounded-full blur-3xl"></div>
	</div>

	<div class="relative max-w-lg mx-auto px-4">
		<!-- Back Button -->
		<a
			href="/dashboard"
			class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
		>
			<ArrowLeftIcon class="w-4 h-4" />
			Back to Dashboard
		</a>

		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-display font-bold text-white mb-2">Wallet Topup</h1>
			<p class="text-gray-400">Add funds to your wallet for instant purchases</p>
		</div>

		<!-- Current Balance Card -->
		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
			<div class="flex items-center gap-4">
				<div class="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
					<WalletIcon class="w-7 h-7 text-emerald-400" />
				</div>
				<div>
					<p class="text-sm text-gray-400">Current Balance</p>
					<p class="text-2xl font-bold text-white">{formatCurrency(data.customer.walletBalance)}</p>
				</div>
			</div>
		</div>

		<!-- Success Message -->
		{#if successMessage}
			<div class="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-start gap-3">
				<CheckCircleIcon class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
				<p class="text-emerald-300 text-sm">{successMessage}</p>
			</div>
		{/if}

		<!-- Error Message -->
		{#if errorMessage || form?.error}
			<div class="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3">
				<AlertCircleIcon class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
				<p class="text-red-300 text-sm">{errorMessage || form?.error}</p>
			</div>
		{/if}

		<!-- Topup Form -->
		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/10">
			<form method="POST" action="?/initialize" use:enhance={handleSubmit} class="space-y-6">
				<!-- Amount Input -->
				<div>
					<label for="amount" class="block text-sm font-medium text-gray-300 mb-2">
						Amount (GHS)
					</label>
					<div class="relative">
						<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">GHS</span>
						<input
							type="number"
							id="amount"
							bind:value={amount}
							placeholder="0.00"
							min={MIN_AMOUNT}
							max={MAX_AMOUNT}
							step="0.01"
							required
							disabled={isProcessing}
							class="w-full pl-14 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-lg font-semibold"
						/>
					</div>
					<p class="mt-2 text-xs text-gray-400">
						Min: {formatCurrency(MIN_AMOUNT)} | Max: {formatCurrency(MAX_AMOUNT)}
					</p>
				</div>

				<!-- Quick Amount Buttons -->
				<div>
					<p class="text-sm text-gray-400 mb-3">Quick select:</p>
					<div class="flex flex-wrap gap-2">
						{#each presetAmounts as preset}
							<button
								type="button"
								onclick={() => (amount = preset.toString())}
								disabled={isProcessing}
								class="px-4 py-2 rounded-lg border border-white/20 text-sm font-medium transition-all {amount === preset.toString()
									? 'bg-primary-500 text-navy-900 border-primary-500'
									: 'text-gray-300 hover:bg-white/10 hover:text-white'}"
							>
								{formatCurrency(preset)}
							</button>
						{/each}
					</div>
				</div>

				<!-- Info Box -->
				<div class="bg-white/5 rounded-xl p-4 space-y-2">
					<div class="flex items-center gap-2 text-sm text-gray-300">
						<CreditCardIcon class="w-4 h-4 text-primary-400" />
						<span class="font-medium">Payment via Mobile Money or Card</span>
					</div>
					<p class="text-xs text-gray-400 pl-6">
						A small processing fee (1-3%) will be added to your payment amount.
					</p>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={!isValidAmount || isProcessing}
					class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-navy-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 text-lg"
				>
					{#if isProcessing}
						<LoaderIcon class="h-5 w-5 animate-spin" />
						Processing...
					{:else if isValidAmount}
						Top Up {formatCurrency(amountValue)}
					{:else}
						Enter Amount
					{/if}
				</button>
			</form>
		</div>

		<!-- Info Text -->
		<p class="text-center text-gray-500 text-sm mt-6">
			Funds will be available immediately after successful payment.
		</p>
	</div>
</section>
