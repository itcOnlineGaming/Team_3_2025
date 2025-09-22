<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="main-nav">
	<button><a href="/home">Home</a></button>
	<button><a href="/map">Map</a></button>
	<button><a href="/tasks">Tasks</a></button>
	<button><a href="/shop">Shop</a></button>
	<button><a href="/avatar">Avatar</a></button>
	<button><a href="/settings">Settings</a></button>
</nav>

<main>
	{@render children?.()}
</main>

<style>
	.main-nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: #f8f9fa;
		padding: 1em;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		z-index: 1000;
		display: flex;
		gap: 0.5em;
	}
	
	.main-nav button {
		padding: 0.5em 1em;
		border: 1px solid #ccc;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
	}
	
	.main-nav button:hover {
		background-color: #e9ecef;
	}
	
	.main-nav button a {
		text-decoration: none;
		color: #333;
	}
	
	main {
		margin-top: 5em;
		padding: 1em;
	}
</style>