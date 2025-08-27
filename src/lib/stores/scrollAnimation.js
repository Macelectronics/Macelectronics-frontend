import { onMount, onDestroy } from 'svelte';

export function useScrollAnimation() {
  let observer;
  
  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-50px'
    });
    
    // Observe all elements with scroll-animation class
    const elements = document.querySelectorAll('.scroll-animation');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  });
  
  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });
}
