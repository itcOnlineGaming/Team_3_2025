<script lang="ts">
	import StressBubbleGraph from '$lib/components/StressBubbleGraph.svelte';
	import { stressStore } from '$lib/stores/stressStore';
	import { calendarStore } from '$lib/stores/calendarStore';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	let showMaxModal = $state(false);
	let showSaveModal = $state(false);
	let showDeleteModal = $state(false);
	let stressorToDelete = $state<string | null>(null);
	let saveType: 'new' | 'override' = $state('new');
	
	function handleRemoveStressor(id: string) {
		stressorToDelete = id;
		showDeleteModal = true;
	}

	function confirmDelete() {
		if (stressorToDelete) {
			stressStore.remove(stressorToDelete);
			stressorToDelete = null;
		}
		showDeleteModal = false;
	}

	function cancelDelete() {
		stressorToDelete = null;
		showDeleteModal = false;
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
		
		const today = new Date();
		const hasEntry = calendarStore.hasEntry(today);
		
		if (hasEntry) {
			saveType = 'override';
			showSaveModal = true;
		} else {
			saveType = 'new';
			saveAndContinue(false);
		}
	}

	function saveAndContinue(override: boolean) {
		const today = new Date();
		calendarStore.saveEntry(today, $stressStore, override);
		showSaveModal = false;
		goto(`${base}/meditation`);
	}

	function continueToMeditation() {
		goto(`${base}/meditation`);
	}

	function closeSaveModal() {
		showSaveModal = false;
	}

	function goToCalendar() {
		goto(`${base}/calendarPage`);
	}

	function handleModalClick(e: MouseEvent) {
		e.stopPropagation();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (showMaxModal) closeMaxModal();
			if (showDeleteModal) cancelDelete();
			if (showSaveModal) closeSaveModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

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

		{#if $stressStore.length > 0}
			<button onclick={goToCalendar} class="calendar-button" type="button">
				📅 View History
			</button>
		{/if}

		<button onclick={handleNextClick} class="next-button" type="button">Save & Continue</button>
	</div>
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

{#if showDeleteModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={cancelDelete} role="dialog" aria-modal="true">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal" onclick={handleModalClick}>
			<h2>Remove Stressor?</h2>
			<p>Are you sure you want to remove this stressor from your graph?</p>
			<div class="modal-buttons">
				<button class="modal-button cancel" onclick={cancelDelete} type="button">Cancel</button>
				<button class="modal-button delete" onclick={confirmDelete} type="button">Remove</button>
			</div>
		</div>
	</div>
{/if}

{#if showSaveModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={closeSaveModal} role="dialog" aria-modal="true">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal" onclick={handleModalClick}>
			<h2>Entry Already Exists</h2>
			<p>You already have an entry saved for today. Would you like to override it with the current data?</p>
			<div class="modal-buttons">
				<button class="modal-button cancel" onclick={closeSaveModal} type="button">Cancel</button>
				<button class="modal-button continue" onclick={continueToMeditation} type="button">Skip Save</button>
				<button class="modal-button save" onclick={() => saveAndContinue(true)} type="button">Override & Save</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.page-container {
		min-height: 100vh;
		padding: 2rem;
		background: #f7ebe4;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
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

	.modal-buttons {
		display: flex;
		gap: 0.75rem;
		flex-direction: column;
	}

	.modal-button {
		padding: 0.75rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.modal-button.cancel {
		background: #e0e0e0;
		color: #666;
	}

	.modal-button.cancel:hover {
		background: #d0d0d0;
	}

	.modal-button.continue {
		background: #FFD700;
		color: #333;
	}

	.modal-button.continue:hover {
		background: #FFC700;
	}

	.modal-button.save {
		background: #e8a87c;
		color: white;
	}

	.modal-button.save:hover {
		background: #d89968;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.modal-button.delete {
		background: #ff6b6b;
		color: white;
	}

	.modal-button.delete:hover {
		background: #ee5555;
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
	}
</style>