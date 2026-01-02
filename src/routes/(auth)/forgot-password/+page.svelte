<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import PhoneIcon from 'lucide-svelte/icons/phone';
	import LockIcon from 'lucide-svelte/icons/lock';
	import KeyIcon from 'lucide-svelte/icons/key';
	import EyeIcon from 'lucide-svelte/icons/eye';
	import EyeOffIcon from 'lucide-svelte/icons/eye-off';
	import LoaderIcon from 'lucide-svelte/icons/loader-2';
	import AlertCircleIcon from 'lucide-svelte/icons/alert-circle';
	import CheckCircleIcon from 'lucide-svelte/icons/check-circle';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';

	let { form }: { form: ActionData } = $props();

	let phoneNumber = $state('');
	let otpCode = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isSubmitting = $state(false);

	// Track current step: 'phone' or 'otp'
	let currentStep = $derived(form?.step === 'otp' ? 'otp' : 'phone');
	let savedPhoneNumber = $derived(form?.phoneNumber || phoneNumber);

	// Reset phone number from form result
	$effect(() => {
		if (form?.phoneNumber) {
			phoneNumber = form.phoneNumber;
		}
	});
</script>

<svelte:head>
	<title>Forgot Password - Macelectronics</title>
	<meta name="description" content="Reset your Macelectronics account password." />
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
			<h1 class="text-3xl font-display font-bold text-white mt-6 mb-2">Reset Password</h1>
			<p class="text-gray-400">
				{#if currentStep === 'phone'}
					Enter your phone number to receive a reset code
				{:else}
					Enter the code sent to your phone
				{/if}
			</p>
		</div>

		<!-- Form Card -->
		<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10 animate-slide-in-up">
			{#if form?.success && currentStep === 'otp'}
				<div class="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-start gap-3">
					<CheckCircleIcon class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
					<p class="text-emerald-300 text-sm">Reset code sent! Check your phone for a 6-digit code.</p>
				</div>
			{/if}

			{#if form?.error}
				<div class="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3">
					<AlertCircleIcon class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
					<p class="text-red-300 text-sm">{form.error}</p>
				</div>
			{/if}

			{#if currentStep === 'phone'}
				<!-- Step 1: Enter Phone Number -->
				<form
					method="POST"
					action="?/requestOTP"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
					class="space-y-6"
				>
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
								bind:value={phoneNumber}
								placeholder="0241234567"
								required
								class="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
							/>
						</div>
						<p class="mt-2 text-xs text-gray-400">We'll send a reset code to this number</p>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-navy-900 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
					>
						{#if isSubmitting}
							<LoaderIcon class="h-5 w-5 animate-spin" />
							Sending Code...
						{:else}
							Send Reset Code
						{/if}
					</button>
				</form>
			{:else}
				<!-- Step 2: Enter OTP and New Password -->
				<form
					method="POST"
					action="?/resetPassword"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
					class="space-y-5"
				>
					<input type="hidden" name="phoneNumber" value={savedPhoneNumber} />

					<!-- Phone Display -->
					<div class="p-3 bg-white/5 rounded-lg">
						<p class="text-sm text-gray-400">Sending code to:</p>
						<p class="text-white font-medium">{savedPhoneNumber}</p>
					</div>

					<!-- OTP Code -->
					<div>
						<label for="otpCode" class="block text-sm font-medium text-gray-300 mb-2">
							Reset Code
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<KeyIcon class="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								id="otpCode"
								name="otpCode"
								bind:value={otpCode}
								placeholder="Enter 6-digit code"
								maxlength="6"
								pattern="[0-9]{6}"
								required
								class="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all tracking-widest text-center text-xl font-mono"
							/>
						</div>
					</div>

					<!-- New Password -->
					<div>
						<label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">
							New Password
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<LockIcon class="h-5 w-5 text-gray-400" />
							</div>
							<input
								type={showPassword ? 'text' : 'password'}
								id="newPassword"
								name="newPassword"
								bind:value={newPassword}
								placeholder="Min. 6 characters"
								required
								minlength="6"
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

					<!-- Confirm Password -->
					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
							Confirm Password
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<LockIcon class="h-5 w-5 text-gray-400" />
							</div>
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								id="confirmPassword"
								name="confirmPassword"
								bind:value={confirmPassword}
								placeholder="Confirm your password"
								required
								minlength="6"
								class="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 disabled:cursor-not-allowed text-navy-900 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
					>
						{#if isSubmitting}
							<LoaderIcon class="h-5 w-5 animate-spin" />
							Resetting Password...
						{:else}
							Reset Password
						{/if}
					</button>

					<!-- Resend Code Link -->
					<p class="text-center text-sm text-gray-400">
						Didn't receive the code?
						<a href="/forgot-password" class="text-primary-400 hover:text-primary-300 transition-colors">
							Request a new one
						</a>
					</p>
				</form>
			{/if}

			<!-- Back to Login -->
			<div class="mt-6 pt-6 border-t border-white/10">
				<a
					href="/login"
					class="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
				>
					<ArrowLeftIcon class="w-4 h-4" />
					Back to Login
				</a>
			</div>
		</div>
	</div>
</section>
