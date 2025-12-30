<script lang="ts">
	interface Props {
		serviceName?: string;
		isVisible?: boolean;
		onClose?: () => void;
	}

	let { serviceName = 'This service', isVisible = false, onClose }: Props = $props();

	function close() {
		onClose?.();
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			close();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			close();
		}
	}
</script>

{#if isVisible}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="popup-title"
		tabindex="-1"
	>
		<div class="bg-white rounded-2xl p-8 mx-4 max-w-md w-full text-center shadow-2xl animate-scale-in">
			<div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<i class="fas fa-clock text-primary-600 text-2xl"></i>
			</div>
			<h3 id="popup-title" class="text-2xl font-display font-bold text-navy-900 mb-2">Coming Soon!</h3>
			<p class="text-gray-600 mb-6">{serviceName} will be available very soon. Stay tuned for updates!</p>
			<button onclick={close} class="bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
				Got it!
			</button>
		</div>
	</div>
{/if}
