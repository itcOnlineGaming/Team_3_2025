<script lang="ts">
	import StressBubbleGraph from '$lib/components/StressBubbleGraph.svelte';
	import { stressStore } from '$lib/stores/stressStore';
	import { base } from '$app/paths';

	let stressors = $state($stressStore);
	
	function handleRemoveStressor(id: string) {
		stressStore.remove(id);
	}
</script>

<div class="page-container">
	<StressBubbleGraph 
		stressors={$stressStore} 
		onRemove={handleRemoveStressor}
	/>

	<div class="action-buttons">
		<a href={`${base}/forum`} class="add-button" title="Add Another Stressor">
			<span class="plus-icon">+</span>
		</a>
		<a href={`${base}/meditation`} class="next-button">Next page</a>
	</div>
</div>

<style>
	.page-container {
		min-height: 100vh;
		padding: 2rem;
		background: #fef5ee;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.add-button {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background-color: #e8a87c;
		color: white;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border: none;
	}

	.add-button:hover {
		background-color: #d89968;
		transform: scale(1.1);
	}

	.plus-icon {
		font-size: 2rem;
		font-weight: 300;
		line-height: 1;
	}

	.next-button {
		padding: 1rem 2.5rem;
		background-color: #e8a87c;
		color: white;
		text-decoration: none;
		border-radius: 25px;
		font-weight: 500;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		cursor: pointer;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.next-button:hover {
		background-color: #d89968;
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}
</style>