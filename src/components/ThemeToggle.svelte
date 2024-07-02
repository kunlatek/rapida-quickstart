<script>
  import { onMount } from 'svelte';
  import { Toggle } from 'flowbite-svelte';

  let theme = 'light';

  const toggleTheme = () => {
    theme = theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  onMount(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        theme = storedTheme;
        document.documentElement.classList.add(theme);
      } else {
        localStorage.setItem('theme', theme);
      }
    }
  });
</script>

<Toggle on:click={toggleTheme}>Light mode</Toggle>
