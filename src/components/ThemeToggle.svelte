<script>
	import { onMount } from 'svelte';
	import { Toggle } from 'flowbite-svelte';

	let theme = 'light';

	const toggleTheme = () => {
		if (typeof window === 'undefined') return;

		const classList = document.documentElement.classList;
		theme = theme === 'dark' ? 'light' : 'dark';
		if (classList.contains('dark')) classList.remove('dark');
		else classList.add('dark');
		localStorage.setItem('theme', theme);
	};

	const capitalizeFirstLetter = (/** @type {string} */ term) => {
		return term.charAt(0).toUpperCase() + term.slice(1);
	};

	onMount(() => {
		if (typeof window === 'undefined') return;

		const storedTheme = localStorage.getItem('theme');
		if (storedTheme !== theme) toggleTheme();
	});
</script>

<Toggle on:click={toggleTheme} checked={theme === 'dark'}>
	{capitalizeFirstLetter(theme)} mode
</Toggle>
