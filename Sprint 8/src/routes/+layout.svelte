<a href="/forum">Go to forum</a>
<a href="/input">Go to input</a>
<a href="/testing">Go to rating</a>
<a href="/Conclusion">Go to Conclusion</a>

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
