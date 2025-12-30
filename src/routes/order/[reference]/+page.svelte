<script lang="ts">
	interface PageData {
		success: boolean;
		status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'PROCESSING';
		message: string;
		reference: string;
		order?: {
			id: string;
			reference: string;
			bundleName: string;
			bundleCapacity: string;
			beneficiaryPhone: string;
			totalPrice: string;
			paymentStatus: string;
			createdAt: string;
		};
	}

	let { data }: { data: PageData } = $props();

	function formatPhone(phone: string): string {
		// Format: 024 123 4567
		return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GH', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const statusConfig = {
		SUCCESS: {
			icon: 'fas fa-check-circle',
			bgColor: 'bg-green-100',
			iconColor: 'text-green-600',
			title: 'Payment Successful!',
			subtitle: 'Your data bundle has been sent'
		},
		PENDING: {
			icon: 'fas fa-clock',
			bgColor: 'bg-yellow-100',
			iconColor: 'text-yellow-600',
			title: 'Order Processing',
			subtitle: 'Your order is being processed'
		},
		PROCESSING: {
			icon: 'fas fa-spinner fa-spin',
			bgColor: 'bg-blue-100',
			iconColor: 'text-blue-600',
			title: 'Verifying Payment',
			subtitle: 'Please wait while we confirm your payment'
		},
		FAILED: {
			icon: 'fas fa-times-circle',
			bgColor: 'bg-red-100',
			iconColor: 'text-red-600',
			title: 'Payment Failed',
			subtitle: 'Something went wrong with your payment'
		}
	};

	let config = $derived(statusConfig[data.status] || statusConfig.FAILED);
</script>

<svelte:head>
	<title>Order Status - Macelectronics</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="min-h-[80vh] flex items-center justify-center py-12 px-4">
	<div class="max-w-md w-full">
		<!-- Status Card -->
		<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
			<!-- Header -->
			<div class="bg-gradient-to-r from-navy-900 to-navy-800 p-8 text-center">
				<div class="w-20 h-20 {config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4">
					<i class="{config.icon} {config.iconColor} text-4xl"></i>
				</div>
				<h1 class="text-2xl font-display font-bold text-white mb-2">{config.title}</h1>
				<p class="text-gray-300">{config.subtitle}</p>
			</div>

			<!-- Order Details -->
			{#if data.order}
				<div class="p-6 border-b border-gray-100">
					<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Details</h2>

					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-gray-600">Bundle</span>
							<span class="font-semibold text-navy-900">{data.order.bundleCapacity} {data.order.bundleName}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Phone Number</span>
							<span class="font-semibold text-navy-900">{formatPhone(data.order.beneficiaryPhone)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Amount Paid</span>
							<span class="font-semibold text-primary-500">GHS {parseFloat(data.order.totalPrice).toFixed(2)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Reference</span>
							<span class="font-mono text-sm text-gray-700">{data.order.reference}</span>
						</div>
						{#if data.order.createdAt}
							<div class="flex justify-between">
								<span class="text-gray-600">Date</span>
								<span class="text-gray-700">{formatDate(data.order.createdAt)}</span>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="p-6 border-b border-gray-100">
					<div class="text-center text-gray-500">
						<p class="mb-2">Reference: <span class="font-mono">{data.reference}</span></p>
						<p class="text-sm">{data.message}</p>
					</div>
				</div>
			{/if}

			<!-- Actions -->
			<div class="p-6">
				{#if data.status === 'SUCCESS'}
					<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
						<div class="flex items-start">
							<i class="fas fa-info-circle text-green-500 mt-0.5 mr-3"></i>
							<div>
								<p class="text-sm text-green-800">Your data bundle has been successfully sent to the recipient's phone number. It should be activated within a few seconds.</p>
							</div>
						</div>
					</div>
				{:else if data.status === 'PENDING'}
					<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
						<div class="flex items-start">
							<i class="fas fa-clock text-yellow-500 mt-0.5 mr-3"></i>
							<div>
								<p class="text-sm text-yellow-800">Your order is being processed. This usually takes a few minutes. You will receive an SMS confirmation once complete.</p>
							</div>
						</div>
					</div>
				{:else if data.status === 'FAILED'}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
						<div class="flex items-start">
							<i class="fas fa-exclamation-triangle text-red-500 mt-0.5 mr-3"></i>
							<div>
								<p class="text-sm text-red-800">
									{data.message || 'Your payment could not be processed. Please try again or contact support if you were charged.'}
								</p>
							</div>
						</div>
					</div>
				{/if}

				<div class="flex flex-col gap-3">
					<a href="/internet" class="w-full bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center">
						{data.status === 'SUCCESS' ? 'Buy More Data' : 'Try Again'}
					</a>
					<a href="/" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center"> Back to Home </a>
				</div>

				<!-- Support Contact -->
				<div class="mt-6 pt-6 border-t border-gray-100 text-center">
					<p class="text-sm text-gray-500 mb-2">Need help with your order?</p>
					<a href="https://wa.me/233000000000" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
						<i class="fab fa-whatsapp mr-2 text-lg"></i>
						Contact Support on WhatsApp
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
