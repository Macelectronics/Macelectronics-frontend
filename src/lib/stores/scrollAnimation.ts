import { onMount } from 'svelte';

export function useScrollAnimation() {
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate');
					}
				});
			},
			{
				threshold: 0.05,
				rootMargin: '50px'
			}
		);

		// Observe all elements with scroll-animation class
		const elements = document.querySelectorAll('.scroll-animation');
		elements.forEach((el) => observer.observe(el));

		// Trigger animation for elements already in viewport on page load
		setTimeout(() => {
			elements.forEach((el) => {
				const rect = el.getBoundingClientRect();
				if (rect.top < window.innerHeight && rect.bottom > 0) {
					el.classList.add('animate');
				}
			});
		}, 100);

		// Cleanup function returned from onMount handles destruction
		return () => {
			observer.disconnect();
		};
	});
}
