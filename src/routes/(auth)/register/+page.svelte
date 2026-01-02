<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import PhoneIcon from 'lucide-svelte/icons/phone';
	import LockIcon from 'lucide-svelte/icons/lock';
	import MailIcon from 'lucide-svelte/icons/mail';
	import UserIcon from 'lucide-svelte/icons/user';
	import EyeIcon from 'lucide-svelte/icons/eye';
	import EyeOffIcon from 'lucide-svelte/icons/eye-off';
	import LoaderIcon from 'lucide-svelte/icons/loader-2';
	import AlertCircleIcon from 'lucide-svelte/icons/alert-circle';
	import CheckCircleIcon from 'lucide-svelte/icons/check-circle';

	let { form }: { form: ActionData } = $props();

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Create Account - Macelectronics</title>
	<meta name="description" content="Create your Macelectronics account to purchase data bundles, track orders, and manage your wallet." />
</svelte:head>

<section class="min-h-screen gradient-bg relative overflow-hidden flex items-center justify-center py-12">
	<div class="absolute inset-0 bg-gradient-to-br from-navy-900/90 to-navy-800/90"></div>

	<!-- Background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
		<div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
	</div>

	<div class="relative w-full max-w-md mx-auto px-4">
		<!-- Logo -->
		<div class="text-center mb-8 animate-fade-in">
			<a href="/" class="inline-block">
				<img src="/img/logo.png" alt="Macelectronics" class="h-12 mx-auto" />
			</a>
			<h1 class="text-3xl font-display font-bold text-white mt-6 mb-2">Create Account</h1>
			<p class="text-gray-400">Join Macelectronics today</p>
		</div>

		<!-- Registration Form -->
		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10 animate-slide-in-up">
			{#if form?.error}
				<div class="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3">
					<AlertCircleIcon class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
					<p class="text-red-300 text-sm">{form.error}</p>
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
				class="space-y-5"
			>
				<!-- Name Fields -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="firstName" class="block text-sm font-medium text-gray-300 mb-2">
							First Name
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<UserIcon class="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								id="firstName"
								name="firstName"
								value={form?.firstName ?? ''}
								placeholder="John"
								class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
							/>
						</div>
					</div>
					<div>
						<label for="lastName" class="block text-sm font-medium text-gray-300 mb-2">
							Last Name
						</label>
						<input
							type="text"
							id="lastName"
							name="lastName"
							value={form?.lastName ?? ''}
							placeholder="Doe"
							class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						/>
					</div>
				</div>

				<!-- Phone Number -->
				<div>
					<label for="phoneNumber" class="block text-sm font-medium text-gray-300 mb-2">
						Phone Number <span class="text-red-400">*</span>
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<PhoneIcon class="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="tel"
							id="phoneNumber"
							name="phoneNumber"
							value={form?.phoneNumber ?? ''}
							placeholder="0241234567"
							required
							class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						/>
					</div>
					<p class="mt-1.5 text-xs text-gray-400">Ghana phone number (e.g., 0241234567)</p>
				</div>

				<!-- Email (Optional) -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-300 mb-2">
						Email <span class="text-gray-500">(Optional)</span>
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<MailIcon class="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="email"
							id="email"
							name="email"
							value={form?.email ?? ''}
							placeholder="john@example.com"
							class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						/>
					</div>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-300 mb-2">
						Password <span class="text-red-400">*</span>
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<LockIcon class="h-5 w-5 text-gray-400" />
						</div>
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							name="password"
							placeholder="Min. 6 characters"
							required
							class="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						/>
						<button
							type="button"
							onclick={() => showPassword = !showPassword}
							class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
						>
							{#if showPassword}
								<EyeOffIcon class="h-5 w-5" />
							{:else}
								<EyeIcon class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>

				<!-- Confirm Password -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
						Confirm Password <span class="text-red-400">*</span>
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<LockIcon class="h-5 w-5 text-gray-400" />
						</div>
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="confirmPassword"
							name="confirmPassword"
							placeholder="Confirm your password"
							required
							class="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						/>
						<button
							type="button"
							onclick={() => showConfirmPassword = !showConfirmPassword}
							class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
						>
							{#if showConfirmPassword}
								<EyeOffIcon class="h-5 w-5" />
							{:else}
								<EyeIcon class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>

				<!-- Benefits -->
				<div class="py-4 space-y-2">
					<div class="flex items-center gap-2 text-sm text-gray-300">
						<CheckCircleIcon class="w-4 h-4 text-primary-400" />
						<span>Track all your orders in one place</span>
					</div>
					<div class="flex items-center gap-2 text-sm text-gray-300">
						<CheckCircleIcon class="w-4 h-4 text-primary-400" />
						<span>Top up your wallet for faster checkout</span>
					</div>
					<div class="flex items-center gap-2 text-sm text-gray-300">
						<CheckCircleIcon class="w-4 h-4 text-primary-400" />
						<span>Access exclusive customer pricing</span>
					</div>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSubmitting}
					class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-navy-900 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
				>
					{#if isSubmitting}
						<LoaderIcon class="h-5 w-5 animate-spin" />
						Creating account...
					{:else}
						Create Account
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-white/10"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-transparent text-gray-400">Already have an account?</span>
				</div>
			</div>

			<!-- Login Link -->
			<a
				href="/login"
				class="w-full inline-flex items-center justify-center border-2 border-primary-500/50 hover:border-primary-500 text-primary-400 hover:text-primary-300 font-medium py-3 px-6 rounded-xl transition-all duration-200"
			>
				Sign In
			</a>
		</div>

		<!-- Back to Home -->
		<div class="text-center mt-6">
			<a href="/" class="text-gray-400 hover:text-white transition-colors text-sm">
				Back to Home
			</a>
		</div>
	</div>
</section>
