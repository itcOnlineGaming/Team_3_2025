<script lang="ts">
	import StressBubbleGraph from '$lib/components/StressBubbleGraph.svelte';
	import { stressStore } from '$lib/stores/stressStore';
	import { base } from '$app/paths';

	let showMaxModal = $state(false);
	
	function handleRemoveStressor(id: string) {
		stressStore.remove(id);
	}

	function handleMaxReached() {
		showMaxModal = true;
	}

	function closeModal() {
		showMaxModal = false;
	}

	function handleAddClick(e: Event) {
		if ($stressStore.length >= 5) {
			e.preventDefault();
			showMaxModal = true;
		}
	}
</script>

<div class="page-container">
	<StressBubbleGraph 
		stressors={$stressStore} 
		onRemove={handleRemoveStressor}
		onMaxReached={handleMaxReached}
	/>

	<div class="action-buttons">
		<a 
			href={`${base}/forum`} 
			class="add-button" 
			class:disabled={$stressStore.length >= 5}
			title={$stressStore.length >= 5 ? "Maximum stressors reached" : "Add Another Stressor"}
			onclick={handleAddClick}
		>
			<span class="plus-icon">+</span>
		</a>
		<a href={`${base}/meditation`} class="next-button">Next page</a>
	</div>
</div>

{#if showMaxModal}
	<div class="modal-overlay" onclick={closeModal}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<h2>Maximum Stressors Reached</h2>
			<p>You can only track up to 5 stressors at a time. Please remove one before adding another.</p>
			<button class="close-button" onclick={closeModal}>Got it</button>
		</div>
	</div>
{/if}

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

	.add-button:hover:not(.disabled) {
		background-color: #d89968;
		transform: scale(1.1);
	}

	.add-button.disabled {
		background-color: #ccc;
		cursor: not-allowed;
		opacity: 0.6;
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

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal {
		background: white;
		padding: 2rem;
		border-radius: 16px;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		animation: slideUp 0.3s ease;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	@keyframes slideUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal h2 {
		color: #2c2c2c;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.modal p {
		color: #6c5545;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.close-button {
		width: 100%;
		padding: 0.75rem;
		background-color: #e8a87c;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.close-button:hover {
		background-color: #d89968;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}
</style>