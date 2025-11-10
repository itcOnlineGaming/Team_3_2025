<a href="/Team_3_2025/forum">Go to forum</a>
<a href="/Team_3_2025/input">Go to input</a>
<a href="/Team_3_2025/Conclusion">Go to Conclusion</a>

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
