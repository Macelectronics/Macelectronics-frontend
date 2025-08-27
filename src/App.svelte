<script>
  import { Router, Route } from 'svelte-routing';
  import { getContext } from 'svelte';
  import Navigation from './lib/components/Navigation.svelte';
  import Footer from './lib/components/Footer.svelte';
  import ComingSoonPopup from './lib/components/ComingSoonPopup.svelte';
  import Home from './routes/Home.svelte';
  import Internet from './routes/Internet.svelte';
  import { onMount } from 'svelte';
  
  let popupVisible = false;
  let popupServiceName = '';
  let currentPath = '';
  
  // Get the location from Router context
  const location = getContext('location');
  
  // Update currentPath when location changes
  $: if (location) {
    currentPath = location.pathname;
  }

  function handleComingSoon(event) {
    popupServiceName = event.detail.serviceName;
    popupVisible = true;
  }

  function closePopup() {
    popupVisible = false;
  }
</script>

<!-- External Dependencies -->
<svelte:head>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="font-body bg-white text-gray-900 overflow-x-hidden antialiased">
  <Router>
    <!-- Navigation -->
    <Navigation 
      {currentPath} 
      on:comingSoon={handleComingSoon}
    />
    
    <!-- Main Content -->
    <main class="pt-16 lg:pt-20">
      <Route path="/">
        <Home on:comingSoon={handleComingSoon} />
      </Route>
      
      <Route path="/internet">
        <Internet on:comingSoon={handleComingSoon} />
      </Route>
      
      <!-- Default route for any unmatched paths -->
      <Route>
        <Home on:comingSoon={handleComingSoon} />
      </Route>
    </main>
    
    <!-- Footer -->
    <Footer on:comingSoon={handleComingSoon} />
    
    <!-- Coming Soon Popup -->
    <ComingSoonPopup 
      serviceName={popupServiceName} 
      on:close={closePopup}
      isVisible={popupVisible}
    />
  </Router>
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
