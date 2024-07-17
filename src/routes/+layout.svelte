<script lang="ts">
	import '../app.css';
</script>

<div
	class="bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex min-h-screen flex-col overflow-hidden"
>
	<main class="relative flex-1 overflow-auto">
		<slot></slot>
	</main>
</div>
