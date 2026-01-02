<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ComingSoonPopup from '$lib/components/ComingSoonPopup.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	let popupVisible = $state(false);
	let popupServiceName = $state('');

	function handleComingSoon(serviceName: string) {
		popupServiceName = serviceName;
		popupVisible = true;
	}

	function closePopup() {
		popupVisible = false;
	}
</script>

<svelte:head>
	<meta name="robots" content="index, follow" />
	<meta name="author" content="Macelectronics Ghana" />
</svelte:head>

<div class="font-body bg-white text-gray-900 overflow-x-hidden antialiased min-h-screen flex flex-col">
	<Navigation onComingSoon={handleComingSoon} customer={data.customer} />

	<main class="pt-16 lg:pt-20 flex-1">
		{@render children()}
	</main>

	<Footer onComingSoon={handleComingSoon} />

	<ComingSoonPopup serviceName={popupServiceName} isVisible={popupVisible} onClose={closePopup} />
</div>
