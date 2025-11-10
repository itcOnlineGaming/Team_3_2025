<script lang="ts">
	import StressBubbleGraph from '$lib/components/StressBubbleGraph.svelte';
	import { stressStore } from '$lib/stores/stressStore';
	import { base } from '$app/paths';

	// Subscribe to the store
	let stressors = $state($stressStore);
</script>

<div class="page-container">
	<StressBubbleGraph stressors={$stressStore} />

	<div class="action-buttons">
		<a href={`${base}/forum`} class="btn btn-secondary">Add Another Stressor</a>
		<button on:click={() => stressStore.clearToday()} class="btn btn-danger">Clear All</button>
    	<a href={`${base}/meditation`} class="submit-button">Submit</a>
	</div>
</div>

<style>
	.page-container {
		min-height: 100vh;
		padding: 2rem;
		background: #f5f7fa;
	}

	.submit-button {
    padding: 1rem 2rem;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  	}


	.action-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 600;
		text-decoration: none;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.btn-secondary {
		background-color: #6366f1;
		color: white;
	}

	.btn-secondary:hover {
		background-color: #4f46e5;
	}

	.btn-danger {
		background-color: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background-color: #dc2626;
	}
</style>