<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	let { children } = $props();
</script>

<a href={`${base}/forum`}>Go to forum</a>
<a href={`${base}/input`}>Go to input</a>
<a href={`${base}/Conclusion`}>Go to conclusion</a>


<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
