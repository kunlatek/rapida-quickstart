<script>
  import '../app.css';
  import ThemeToggle from '../components/ThemeToggle.svelte';
</script>

<div class="bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text min-h-screen flex flex-col overflow-hidden">
  <header class="p-4 bg-primary-500 text-white w-full">
    <ThemeToggle />
  </header>
  <main class="flex-1 p-4 overflow-auto relative">
    <slot></slot>
  </main>
</div>
