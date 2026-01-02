<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import UserIcon from 'lucide-svelte/icons/user';
	import WalletIcon from 'lucide-svelte/icons/wallet';
	import ShoppingCartIcon from 'lucide-svelte/icons/shopping-cart';
	import PackageIcon from 'lucide-svelte/icons/package';
	import LogOutIcon from 'lucide-svelte/icons/log-out';
	import PhoneIcon from 'lucide-svelte/icons/phone';
	import CheckCircleIcon from 'lucide-svelte/icons/check-circle';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import XCircleIcon from 'lucide-svelte/icons/x-circle';
	import AlertCircleIcon from 'lucide-svelte/icons/alert-circle';
	import ChevronLeftIcon from 'lucide-svelte/icons/chevron-left';
	import ChevronRightIcon from 'lucide-svelte/icons/chevron-right';
	import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';

	let { data }: { data: PageData } = $props();

	function formatDate(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatCurrency(amount: string | number): string {
		const num = typeof amount === 'string' ? parseFloat(amount) : amount;
		return new Intl.NumberFormat('en-GH', {
			style: 'currency',
			currency: 'GHS'
		}).format(num);
	}

	function getStatusColor(status: string): string {
		switch (status.toUpperCase()) {
			case 'SUCCESS':
			case 'COMPLETED':
				return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
			case 'PENDING':
			case 'PROCESSING':
				return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
			case 'FAILED':
			case 'CANCELLED':
				return 'bg-red-500/20 text-red-400 border-red-500/30';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
		}
	}

	function getStatusIcon(status: string) {
		switch (status.toUpperCase()) {
			case 'SUCCESS':
			case 'COMPLETED':
				return CheckCircleIcon;
			case 'PENDING':
			case 'PROCESSING':
				return ClockIcon;
			case 'FAILED':
			case 'CANCELLED':
				return XCircleIcon;
			default:
				return AlertCircleIcon;
		}
	}
</script>

<svelte:head>
	<title>Dashboard - Macelectronics</title>
	<meta name="description" content="Manage your Macelectronics account, view orders, and track your wallet balance." />
</svelte:head>

<section class="min-h-screen gradient-bg relative overflow-hidden py-8">
	<div class="absolute inset-0 bg-gradient-to-br from-navy-900/95 to-navy-800/95"></div>

	<!-- Background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/5 rounded-full blur-3xl"></div>
		<div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/5 rounded-full blur-3xl"></div>
	</div>

	<div class="relative max-w-6xl mx-auto px-4">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
			<div>
				<h1 class="text-3xl font-display font-bold text-white">
					Welcome, {data.customer.firstName || 'Customer'}!
				</h1>
				<p class="text-gray-400 mt-1">Manage your account and orders</p>
			</div>
			<form method="POST" action="?/logout" use:enhance>
				<button
					type="submit"
					class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all"
				>
					<LogOutIcon class="w-4 h-4" />
					Sign Out
				</button>
			</form>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<!-- Profile Card -->
			<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
						<UserIcon class="w-6 h-6 text-primary-400" />
					</div>
					<div>
						<p class="text-sm text-gray-400">Account</p>
						<p class="text-white font-semibold">{data.customer.tier}</p>
					</div>
				</div>
			</div>

			<!-- Phone Card -->
			<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
						<PhoneIcon class="w-6 h-6 text-blue-400" />
					</div>
					<div>
						<p class="text-sm text-gray-400">Phone</p>
						<p class="text-white font-semibold">{data.customer.phoneNumber}</p>
					</div>
				</div>
			</div>

			<!-- Wallet Card -->
			<a href="/dashboard/wallet" class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors block">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
						<WalletIcon class="w-6 h-6 text-emerald-400" />
					</div>
					<div class="flex-1">
						<p class="text-sm text-gray-400">Wallet Balance</p>
						<p class="text-white font-semibold">{formatCurrency(data.customer.walletBalance)}</p>
					</div>
					<span class="text-xs text-primary-400 font-medium">Top Up</span>
				</div>
			</a>

			<!-- Orders Card -->
			<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
						<ShoppingCartIcon class="w-6 h-6 text-violet-400" />
					</div>
					<div>
						<p class="text-sm text-gray-400">Total Orders</p>
						<p class="text-white font-semibold">{data.pagination.totalCount}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="mb-8">
			<a
				href="/internet"
				class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-navy-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
			>
				<PackageIcon class="w-5 h-5" />
				Buy Data Bundle
				<ArrowRightIcon class="w-4 h-4" />
			</a>
		</div>

		<!-- Orders Section -->
		<div class="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
			<div class="p-6 border-b border-white/10">
				<h2 class="text-xl font-semibold text-white flex items-center gap-2">
					<ShoppingCartIcon class="w-5 h-5 text-primary-400" />
					Recent Orders
				</h2>
			</div>

			{#if data.orders.length === 0}
				<div class="p-12 text-center">
					<PackageIcon class="w-16 h-16 text-gray-600 mx-auto mb-4" />
					<h3 class="text-lg font-semibold text-white mb-2">No orders yet</h3>
					<p class="text-gray-400 mb-6">Start by purchasing a data bundle</p>
					<a
						href="/internet"
						class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-navy-900 font-semibold py-2.5 px-5 rounded-xl transition-all"
					>
						Browse Bundles
						<ArrowRightIcon class="w-4 h-4" />
					</a>
				</div>
			{:else}
				<!-- Desktop Table -->
				<div class="hidden md:block overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-white/10">
								<th class="text-left text-sm font-medium text-gray-400 px-6 py-4">Order</th>
								<th class="text-left text-sm font-medium text-gray-400 px-6 py-4">Bundle</th>
								<th class="text-left text-sm font-medium text-gray-400 px-6 py-4">Recipient</th>
								<th class="text-right text-sm font-medium text-gray-400 px-6 py-4">Amount</th>
								<th class="text-center text-sm font-medium text-gray-400 px-6 py-4">Status</th>
								<th class="text-right text-sm font-medium text-gray-400 px-6 py-4">Date</th>
							</tr>
						</thead>
						<tbody>
							{#each data.orders as order}
								<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
									<td class="px-6 py-4">
										<span class="text-white font-mono text-sm">{order.orderNumber}</span>
									</td>
									<td class="px-6 py-4">
										<span class="text-white">{order.bundleName}</span>
									</td>
									<td class="px-6 py-4">
										<span class="text-gray-300 font-mono">{order.beneficiaryPhone}</span>
									</td>
									<td class="px-6 py-4 text-right">
										<span class="text-white font-semibold">{formatCurrency(order.amount)}</span>
									</td>
									<td class="px-6 py-4 text-center">
										<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border {getStatusColor(order.status)}">
											<svelte:component this={getStatusIcon(order.status)} class="w-3.5 h-3.5" />
											{order.status}
										</span>
									</td>
									<td class="px-6 py-4 text-right">
										<span class="text-gray-400 text-sm">{formatDate(order.createdAt)}</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Mobile Cards -->
				<div class="md:hidden divide-y divide-white/10">
					{#each data.orders as order}
						<div class="p-4">
							<div class="flex items-start justify-between mb-3">
								<div>
									<p class="text-white font-semibold">{order.bundleName}</p>
									<p class="text-gray-400 text-sm font-mono">{order.orderNumber}</p>
								</div>
								<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border {getStatusColor(order.status)}">
									<svelte:component this={getStatusIcon(order.status)} class="w-3 h-3" />
									{order.status}
								</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<div class="flex items-center gap-2 text-gray-400">
									<PhoneIcon class="w-4 h-4" />
									<span class="font-mono">{order.beneficiaryPhone}</span>
								</div>
								<span class="text-white font-semibold">{formatCurrency(order.amount)}</span>
							</div>
							<p class="text-gray-500 text-xs mt-2">{formatDate(order.createdAt)}</p>
						</div>
					{/each}
				</div>

				<!-- Pagination -->
				{#if data.pagination.totalPages > 1}
					<div class="p-6 border-t border-white/10 flex items-center justify-between">
						<p class="text-sm text-gray-400">
							Page {data.pagination.page} of {data.pagination.totalPages}
						</p>
						<div class="flex items-center gap-2">
							{#if data.pagination.page > 1}
								<a
									href="?page={data.pagination.page - 1}"
									class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all text-sm"
								>
									<ChevronLeftIcon class="w-4 h-4" />
									Previous
								</a>
							{/if}
							{#if data.pagination.hasMore}
								<a
									href="?page={data.pagination.page + 1}"
									class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all text-sm"
								>
									Next
									<ChevronRightIcon class="w-4 h-4" />
								</a>
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</section>
