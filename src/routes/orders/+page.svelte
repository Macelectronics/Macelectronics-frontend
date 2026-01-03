<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';
	import type { OrderItem } from './+page.server';

	let { data, form }: PageProps = $props();

	let phoneInput = $state(data.phone || '');
	let isLoading = $state(false);

	// Handle form submission to redirect with query param
	function handleSubmit(event: Event) {
		event.preventDefault();
		if (phoneInput && /^0[235][0-9]{8}$/.test(phoneInput)) {
			isLoading = true;
			goto(`/orders?phone=${encodeURIComponent(phoneInput)}`);
		}
	}

	function formatPhone(phone: string): string {
		return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GH', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatPrice(price: string): string {
		return `GHS ${parseFloat(price).toFixed(2)}`;
	}

	function getStatusColor(status: string): string {
		switch (status?.toUpperCase()) {
			case 'SUCCESS':
			case 'SERVED':
				return 'bg-green-100 text-green-800';
			case 'PENDING':
			case 'SERVING':
				return 'bg-yellow-100 text-yellow-800';
			case 'FAILED':
			case 'REFUNDED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getStatusText(paymentStatus: string, orderStatus: string): string {
		if (paymentStatus === 'SUCCESS') {
			switch (orderStatus?.toUpperCase()) {
				case 'SERVED':
					return 'Delivered';
				case 'SERVING':
					return 'Delivering';
				case 'FAILED':
					return 'Delivery Failed';
				case 'PENDING':
				default:
					return 'Processing';
			}
		}
		switch (paymentStatus?.toUpperCase()) {
			case 'PENDING':
				return 'Payment Pending';
			case 'FAILED':
				return 'Payment Failed';
			default:
				return paymentStatus;
		}
	}

	const isValidPhone = $derived(/^0[235][0-9]{8}$/.test(phoneInput));
</script>

<svelte:head>
	<title>Track Order - Macelectronics</title>
	<meta name="description" content="Track your data bundle order status" />
</svelte:head>

<section class="min-h-[80vh] py-12 px-4">
	<div class="max-w-lg mx-auto">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-display font-bold text-navy-900 mb-2">Track Your Order</h1>
			<p class="text-gray-600">Enter your phone number to view your recent orders</p>
		</div>

		<!-- Phone Lookup Form -->
		<div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
						Phone Number
					</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
								/>
							</svg>
						</span>
						<input
							type="tel"
							id="phone"
							name="phone"
							placeholder="0241234567"
							maxlength={10}
							bind:value={phoneInput}
							class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
						/>
					</div>
					{#if phoneInput && !isValidPhone}
						<p class="mt-1 text-sm text-red-500">
							Enter a valid 10-digit phone number (e.g., 0241234567)
						</p>
					{/if}
				</div>

				<button
					type="submit"
					disabled={!isValidPhone || isLoading}
					class="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-navy-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
				>
					{#if isLoading}
						<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Looking up...
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.35-4.35" />
						</svg>
						Find Orders
					{/if}
				</button>
			</form>
		</div>

		<!-- Results -->
		{#if data.phone}
			{#if data.error}
				<div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
					<div class="flex items-center gap-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-red-500"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						<p class="text-red-800">{data.error}</p>
					</div>
				</div>
			{:else if data.orders && data.orders.length > 0}
				<div class="space-y-4">
					<h2 class="text-lg font-semibold text-gray-700">
						Recent Orders for {formatPhone(data.phone)}
					</h2>

					{#each data.orders as order}
						<div class="bg-white rounded-xl shadow-md overflow-hidden">
							<!-- Order Header -->
							<div
								class="bg-gradient-to-r from-navy-900 to-navy-800 px-4 py-3 flex justify-between items-center"
							>
								<span class="text-white/70 text-sm">
									{formatDate(order.createdAt)}
								</span>
								<span
									class="px-2 py-1 rounded-full text-xs font-medium {getStatusColor(
										order.orderStatus || order.paymentStatus
									)}"
								>
									{getStatusText(order.paymentStatus, order.orderStatus)}
								</span>
							</div>

							<!-- Order Details -->
							<div class="p-4 space-y-3">
								<div class="flex justify-between items-start">
									<div>
										<p class="font-semibold text-navy-900">
											{order.bundleCapacity}
										</p>
										<p class="text-sm text-gray-500">{order.offerName}</p>
									</div>
									<p class="text-lg font-bold text-primary-500">
										{formatPrice(order.totalPrice)}
									</p>
								</div>

								<div class="flex items-center gap-2 text-sm text-gray-600">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
										/>
									</svg>
									<span>Sent to: {formatPhone(order.beneficiaryPhone)}</span>
								</div>

								{#if order.reference}
									<div class="pt-2 border-t border-gray-100">
										<p class="text-xs text-gray-400">
											Ref: <span class="font-mono">{order.reference}</span>
										</p>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="bg-gray-50 rounded-xl p-8 text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-12 w-12 mx-auto text-gray-400 mb-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<h3 class="text-lg font-semibold text-gray-700 mb-2">No Orders Found</h3>
					<p class="text-gray-500">We couldn't find any orders for this phone number.</p>
				</div>
			{/if}
		{/if}

		<!-- Back to Home -->
		<div class="mt-8 text-center">
			<a
				href="/"
				class="inline-flex items-center text-gray-600 hover:text-primary-500 transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 mr-2"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
				Back to Home
			</a>
		</div>
	</div>
</section>
