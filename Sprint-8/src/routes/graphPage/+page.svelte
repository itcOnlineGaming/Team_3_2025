<script lang="ts">
	import StressBubbleGraph from '$lib/components/StressBubbleGraph.svelte';
	import { stressStore, type Stressor } from '$lib/stores/stressStore';
	import { calendarStore } from '$lib/stores/calendarStore';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let showMaxModal = $state(false);
	let isLoading = $state(true);
	
	// Auto-save functionality
	let autoSaveTimeout: number | null = null;
	let hasLoadedInitialData = false;
	let lastSavedCount = 0;
	
	// Load today's data on mount if it exists
	onMount(() => {
		const today = new Date();
		const existingEntry = calendarStore.getEntry(today);
		const currentStoreCount = $stressStore.length;
		
		console.log('onMount - Current store count:', currentStoreCount);
		console.log('onMount - Saved entry count:', existingEntry?.stressors.length || 0);
		
		// Only load saved data if the store is empty OR has fewer items than saved
		// This prevents overwriting newly added stressors from the forum page
		if (existingEntry && existingEntry.stressors.length > 0 && currentStoreCount === 0) {
			console.log('Loading saved stressors');
			stressStore.loadStressors(existingEntry.stressors);
			lastSavedCount = existingEntry.stressors.length;
		} else if (currentStoreCount > 0) {
			console.log('Keeping current store data (newly added stressor detected)');
			lastSavedCount = currentStoreCount;
		}
		
		// Small delay to ensure everything is loaded
		setTimeout(() => {
			hasLoadedInitialData = true;
			isLoading = false;
		}, 100);
	});

	// Auto-save whenever stressors change (but only after initial load)
	$effect(() => {
		const stressors = $stressStore;
		
		// Skip auto-save until initial data is loaded
		if (!hasLoadedInitialData) return;
		
		// Clear existing timeout
		if (autoSaveTimeout) {
			clearTimeout(autoSaveTimeout);
		}
		
		// Set new timeout to save after 500ms of no changes
		autoSaveTimeout = window.setTimeout(() => {
			const today = new Date();
			if (stressors.length > 0) {
				calendarStore.saveEntry(today, stressors, true);
				lastSavedCount = stressors.length;
			} else if (lastSavedCount > 0) {
				// Only delete if there were stressors before
				calendarStore.deleteEntry(today);
				lastSavedCount = 0;
			}
		}, 500);
		
		return () => {
			if (autoSaveTimeout) {
				clearTimeout(autoSaveTimeout);
			}
		};
	});

	function handleIntensityChange(id: string, newIntensity: number) {
		// Use the new updateIntensity method which handles removal when intensity <= 0
		stressStore.updateIntensity(id, newIntensity);
	}

	function handleMaxReached() {
		showMaxModal = true;
	}

	function closeMaxModal() {
		showMaxModal = false;
	}

	function handleAddClick(e: Event) {
		if ($stressStore.length >= 5) {
			e.preventDefault();
			showMaxModal = true;
		}
	}

	function handleNextClick(e: Event) {
		e.preventDefault();
		
		// Make sure data is saved before continuing
		if ($stressStore.length > 0) {
			const today = new Date();
			calendarStore.saveEntry(today, $stressStore, true);
		}
		
		goto(`${base}/meditation`);
	}

	function goToCalendar() {
		// Save before navigating
		if ($stressStore.length > 0) {
			const today = new Date();
			calendarStore.saveEntry(today, $stressStore, true);
		}
		goto(`${base}/calendarPage`);
	}

	function handleModalClick(e: MouseEvent) {
		e.stopPropagation();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (showMaxModal) closeMaxModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="page-container">
	{#if !isLoading}
		<div class="help-popup">
			<div class="help-content">
			<h3>Steps:</h3>
			<ol>
				<li>Reflect on your activities and what stresses you.</li>
				<li>Add another stressor to the graph</li>
				<li>Increase the stress level of a bubble</li>
				<li>Decrease the stress level of a bubble</li>
				<li>View your stressors in the calendar</li>
				<li>Click Continue to Meditation</li>
			</ol>
			</div>
  		</div>

		<StressBubbleGraph 
			stressors={$stressStore} 
			onIntensityChange={handleIntensityChange}
			onRemove={handleIntensityChange}
			onMaxReached={handleMaxReached}
		>
		
		<a 
		href={`${base}/forum`} 
		class="add-button" 
		class:disabled={$stressStore.length >= 5}
		title={$stressStore.length >= 5 ? "Maximum stressors reached" : "Add Another Stressor"}
		onclick={handleAddClick}
		>
		<span class="plus-icon">+</span>
	</a>
			{#if $stressStore.length > 0}
				<button onclick={goToCalendar} class="calendar-button" type="button">
					View Calendar
				</button>
			{/if}

			<button onclick={handleNextClick} class="next-button" type="button">Continue to Meditation</button>
			</StressBubbleGraph>
		
		{#if $stressStore.length > 0}
			<div class="auto-save-indicator">
				<span class="save-icon"></span> Auto-saved
			</div>
		{/if}
	{/if}
</div>

{#if showMaxModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={closeMaxModal} role="dialog" aria-modal="true">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal" onclick={handleModalClick}>
			<h2>Maximum Stressors Reached</h2>
			<p>You can only track up to 5 stressors at a time. Please remove one before adding another.</p>
			<button class="close-button" onclick={closeMaxModal} type="button">Got it</button>
		</div>
	</div>
{/if}

<style>
	.page-container {
		min-height: 100vh;
		padding: 2rem;
		background: #e8a87c;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
		position: relative;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin-top: 2rem;
		flex-wrap: wrap;
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

	.calendar-button {
		padding: 1rem 2rem;
		background-color: #6c5ce7;
		color: white;
		border: none;
		border-radius: 25px;
		font-weight: 500;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		cursor: pointer;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
		font-size: 1rem;
	}

	.calendar-button:hover {
		background-color: #5f4dd1;
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
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
		border: none;
		font-size: 1rem;
	}

	.next-button:hover {
		background-color: #d89968;
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.auto-save-indicator {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: #4CAF50;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 25px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		animation: slideIn 0.3s ease;
		z-index: 100;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.save-icon {
		font-size: 1.2rem;
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
		from { opacity: 0; }
		to { opacity: 1; }
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

	@media (max-width: 600px) {
		.action-buttons {
			flex-direction: column;
			gap: 1rem;
		}

		.calendar-button,
		.next-button {
			width: 100%;
		}

		.auto-save-indicator {
			bottom: 1rem;
			right: 1rem;
			font-size: 0.8rem;
			padding: 0.6rem 1.2rem;
		}
	}

	.help-popup {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-width: 250px;
}

.help-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
  font-family: BlinkMacSystemFont, -apple-system, sans-serif;
}

.help-content ol {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

.help-content li {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.help-content li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .help-popup {
    display: none;
  }
}
</style>