<script>
  import Toast from "$lib/components/common/Toast.svelte";
  import Navbar from "$lib/components/common/Navbar.svelte";
  import Footer from "$lib/components/common/Footer.svelte";
  
  // Import the CSS
  import "../app.css";
 </script>
 
 <Navbar />
  
 <div class="flex flex-col min-h-screen">
  <div class="flex-grow container mx-auto px-4 py-8">
   <slot />
  </div>
 </div>
 
 <Footer />