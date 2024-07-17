<script lang="ts">
	import { onMount } from 'svelte';
	import { Toggle } from 'flowbite-svelte';

	let theme = 'light';

	const toggleTheme = () => {
		if (typeof window === 'undefined') return;

		const classList = document.documentElement.classList;
		theme = theme === 'dark' ? 'light' : 'dark';

		if (theme === 'light') classList.remove('dark');
		else classList.add('dark');

		localStorage.setItem('theme', theme);
	};

	const capitalizeFirstLetter = (term: string) => {
		return term.charAt(0).toUpperCase() + term.slice(1);
	};

	onMount(() => {
		if (typeof window === 'undefined') return;
		setInitalTheme();
	});

	const setInitalTheme = () => {
		if (typeof window === 'undefined') return;

		const storedTheme = localStorage.getItem('theme');
		theme = storedTheme || 'light';
		const classList = document.documentElement.classList;
		if (!storedTheme) {
			classList.remove('dark');
			localStorage.setItem('theme', 'light');
		} else if (storedTheme === 'dark') {
			classList.add('dark');
		} else {
			classList.remove('dark');
		}
	};
</script>

<Toggle on:click={toggleTheme} checked={theme === 'dark'}>
	{capitalizeFirstLetter(theme)} mode
</Toggle>
