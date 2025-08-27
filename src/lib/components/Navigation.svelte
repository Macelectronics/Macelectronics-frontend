<script>
  import { createEventDispatcher } from 'svelte';
  import { link } from 'svelte-routing';
  
  export let currentPath = '/';
  
  const dispatch = createEventDispatcher();
  
  let mobileMenuOpen = false;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
  
  function showComingSoonPopup(serviceName) {
    dispatch('comingSoon', { serviceName });
  }
</script>

<nav class="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 shadow-lg fixed w-full top-0 left-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16 lg:h-20">
      <!-- Logo -->
      <div class="flex-shrink-0 animate-fade-in">
        <a href="/" use:link class="flex items-center">
          <div class="bg-primary-400 p-2 rounded-lg mr-3">
            <div class="w-6 h-6 bg-white rounded flex items-center justify-center">
              <i class="fas fa-mobile-alt text-primary-600 text-sm"></i>
            </div>
          </div>
          <span class="text-white font-display font-bold text-xl lg:text-2xl tracking-wide">MACELECTRONICS</span>
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden lg:block animate-fade-in-down">
        <div class="ml-10 flex items-baseline space-x-8">
          <a 
            href="/" 
            use:link 
            class="px-3 py-2 text-sm font-medium transition-colors duration-200 {currentPath === '/' ? 'text-white border-b-2 border-primary-400' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-primary-400'}"
          >
            Home
          </a>
          <a 
            href="/internet" 
            use:link 
            class="px-3 py-2 text-sm font-medium transition-colors duration-200 {currentPath === '/internet' ? 'text-white border-b-2 border-primary-400' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-primary-400'}"
          >
            Internet
          </a>
          <button 
            on:click={() => showComingSoonPopup('TV Services')} 
            class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-primary-400"
          >
            TV
          </button>
          <button 
            on:click={() => showComingSoonPopup('Utility Bills')} 
            class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-primary-400"
          >
            Utility Bills
          </button>
          <button 
            on:click={() => showComingSoonPopup('Mobile Airtime')} 
            class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-primary-400"
          >
            Mobile Airtime
          </button>
        </div>
      </div>
      
      <!-- Agent Login Button -->
      <div class="hidden lg:block animate-fade-in">
        <button 
          on:click={() => showComingSoonPopup('Agent Login')} 
          class="bg-primary-400 hover:bg-primary-500 text-navy-900 font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          AGENT LOGIN
        </button>
      </div>
      
      <!-- Mobile menu button -->
      <div class="lg:hidden">
        <button 
          on:click={toggleMobileMenu} 
          class="hamburger text-white p-2 {mobileMenuOpen ? 'hamburger-active' : ''}"
        >
          <div class="w-6 h-0.5 bg-white hamburger-line line1 mb-1"></div>
          <div class="w-6 h-0.5 bg-white hamburger-line line2 mb-1"></div>
          <div class="w-6 h-0.5 bg-white hamburger-line line3"></div>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile menu -->
  <div class="mobile-menu lg:hidden fixed inset-0 bg-navy-900 bg-opacity-95 backdrop-blur-lg transform {mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} z-40 overflow-y-auto">
    <!-- Close button -->
    <div class="absolute top-6 right-6">
      <button 
        on:click={closeMobileMenu} 
        class="text-white p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
      >
        <i class="fas fa-times text-2xl"></i>
      </button>
    </div>
    
    <div class="flex flex-col h-full justify-center items-center space-y-8">
      <a 
        href="/" 
        use:link 
        on:click={closeMobileMenu} 
        class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110 {currentPath === '/' ? 'text-primary-300' : ''}"
      >
        Home
      </a>
      <a 
        href="/internet" 
        use:link 
        on:click={closeMobileMenu} 
        class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110 {currentPath === '/internet' ? 'text-primary-300' : ''}"
      >
        Internet
      </a>
      <button 
        on:click={() => { showComingSoonPopup('TV Services'); closeMobileMenu(); }} 
        class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110"
      >
        TV
      </button>
      <button 
        on:click={() => { showComingSoonPopup('Utility Bills'); closeMobileMenu(); }} 
        class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110"
      >
        Utility Bills
      </button>
      <button 
        on:click={() => { showComingSoonPopup('Mobile Airtime'); closeMobileMenu(); }} 
        class="text-white text-2xl font-medium hover:text-primary-300 transition-colors duration-200 transform hover:scale-110"
      >
        Mobile Airtime
      </button>
      <button 
        on:click={() => { showComingSoonPopup('Agent Login'); closeMobileMenu(); }} 
        class="bg-primary-400 hover:bg-primary-500 text-navy-900 font-display font-bold py-4 px-10 rounded-xl transition-all duration-200 transform hover:scale-105 text-xl shadow-lg hover:shadow-xl tracking-wide"
      >
        AGENT LOGIN
      </button>
    </div>
  </div>
</nav>
