<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';
	import PhoneIcon from 'lucide-svelte/icons/phone';
	import LockIcon from 'lucide-svelte/icons/lock';
	import EyeIcon from 'lucide-svelte/icons/eye';
	import EyeOffIcon from 'lucide-svelte/icons/eye-off';
	import LoaderIcon from 'lucide-svelte/icons/loader-2';
	import AlertCircleIcon from 'lucide-svelte/icons/alert-circle';
	import CheckCircleIcon from 'lucide-svelte/icons/check-circle';

	let { form }: { form: ActionData } = $props();

	let showPassword = $state(false);
	let isSubmitting = $state(false);

	// Check if user just registered or reset password
	let justRegistered = $derived($page.url.searchParams.get('registered') === 'true');
	let justResetPassword = $derived($page.url.searchParams.get('reset') === 'true');
</script>

<svelte:head>
	<title>Login - Macelectronics</title>
	<meta name="description" content="Login to your Macelectronics account to purchase data bundles and manage your orders." />
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
			<h1 class="text-3xl font-display font-bold text-white mt-6 mb-2">Welcome Back</h1>
			<p class="text-gray-400">Sign in to continue to your account</p>
		</div>

		<!-- Login Form -->
		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10 animate-slide-in-up">
			{#if justRegistered}
				<div class="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-start gap-3">
					<CheckCircleIcon class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
					<p class="text-emerald-300 text-sm">Account created successfully! Please sign in with your credentials.</p>
				</div>
			{/if}

			{#if justResetPassword}
				<div class="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-start gap-3">
					<CheckCircleIcon class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
					<p class="text-emerald-300 text-sm">Password reset successfully! Please sign in with your new password.</p>
				</div>
			{/if}

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
				class="space-y-6"
			>
				<!-- Phone Number -->
				<div>
					<label for="phoneNumber" class="block text-sm font-medium text-gray-300 mb-2">
						Phone Number
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
							class="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						/>
					</div>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-300 mb-2">
						Password
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<LockIcon class="h-5 w-5 text-gray-400" />
						</div>
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							name="password"
							placeholder="Enter your password"
							required
							class="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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

				<!-- Forgot Password -->
				<div class="flex justify-end">
					<a href="/forgot-password" class="text-sm text-primary-400 hover:text-primary-300 transition-colors">
						Forgot password?
					</a>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSubmitting}
					class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-navy-900 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
				>
					{#if isSubmitting}
						<LoaderIcon class="h-5 w-5 animate-spin" />
						Signing in...
					{:else}
						Sign In
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-8">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-white/10"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-transparent text-gray-400">New to Macelectronics?</span>
				</div>
			</div>

			<!-- Register Link -->
			<a
				href="/register"
				class="w-full inline-flex items-center justify-center border-2 border-primary-500/50 hover:border-primary-500 text-primary-400 hover:text-primary-300 font-medium py-3.5 px-6 rounded-xl transition-all duration-200"
			>
				Create an Account
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
