<script lang="ts">
	import CalendarMonth from '$lib/components/CalendarMonth.svelte';
	import StressBubbleGraph from '$lib/components/StressBubbleGraph.svelte';
	import { calendarStore, type DayEntry } from '$lib/stores/calendarStore';
	import { base } from '$app/paths';

	let selectedEntry = $state<DayEntry | null>(null);
	let selectedDate = $state<Date | null>(null);
	let selectedDateStr = $state<string>('');
	let showDetailModal = $state(false);

	// Force reactivity by subscribing to store changes
	let calendarData = $state($calendarStore);
	
	$effect(() => {
		calendarData = $calendarStore;
	});

	function handleDayClick(date: Date, entry: DayEntry | null) {
		if (entry) {
			selectedEntry = entry;
			selectedDate = date;
			selectedDateStr = date.toLocaleDateString('en-US', { 
				weekday: 'long', 
				month: 'long', 
				day: 'numeric',
				year: 'numeric'
			});
			showDetailModal = true;
		}
	}

	function closeDetailModal() {
		showDetailModal = false;
		selectedEntry = null;
		selectedDate = null;
	}

	function handleModalClick(e: MouseEvent) {
		e.stopPropagation();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && showDetailModal) {
			closeDetailModal();
		}
	}

	function handleIntensityChange(id: string, newIntensity: number) {
		if (!selectedEntry || !selectedDate) return;
		
		// Find and update the stressor
		const updatedStressors = selectedEntry.stressors.map(s => 
			s.id === id ? { ...s, intensity: newIntensity } : s
		).filter(s => s.intensity > 0); // Remove if intensity becomes 0
		
		if (updatedStressors.length === 0) {
			// If no stressors left, delete the entire entry
			calendarStore.deleteEntry(selectedDate);
			closeDetailModal();
			calendarData = $calendarStore;
		} else {
			// Update the entry with modified stressors
			calendarStore.saveEntry(selectedDate, updatedStressors, true);
			// Update local state to show changes immediately
			selectedEntry = { ...selectedEntry, stressors: updatedStressors };
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="calendar-page">
	<div class="page-header">
		<h1>Your Stress History</h1>
		<p>Track your emotional journey over time</p>
		<a href={`${base}/graphPage`} class="back-button">← Back to Graph</a>
	</div>

	<CalendarMonth onDayClick={handleDayClick} />
</div>

{#if showDetailModal && selectedEntry && selectedDate}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={closeDetailModal} role="dialog" aria-modal="true">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-content" onclick={handleModalClick}>
			<button class="close-btn" onclick={closeDetailModal} type="button" aria-label="Close modal">×</button>
			
			<h2>{selectedDateStr}</h2>
			
			<div class="detail-graph">
				<StressBubbleGraph 
					stressors={selectedEntry.stressors}
					date={selectedDate}
					onIntensityChange={handleIntensityChange}
					readonly={false}
				/>
			</div>

			<div class="stressor-list">
				<h3>Stressors for this day:</h3>
				{#each selectedEntry.stressors as stressor}
					<div class="stressor-item">
						<div class="stressor-header">
							<span class="stressor-text">{stressor.text}</span>
							<span class="intensity-badge" style="background: {
								stressor.intensity === 5 ? '#E91E63' :
								stressor.intensity === 4 ? '#FF69B4' :
								stressor.intensity === 3 ? '#FFA500' :
								stressor.intensity === 2 ? '#FFD700' : '#9ACD32'
							}">{stressor.intensity}</span>
						</div>
						<div class="stressor-mood">{stressor.mood}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.calendar-page {
		min-height: 100vh;
		padding: 2rem;
		background: #fef5ee;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.page-header {
		max-width: 900px;
		margin: 0 auto 2rem;
		text-align: center;
	}

	.page-header h1 {
		font-size: 2.5rem;
		color: #2c2c2c;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.page-header p {
		color: #6c5545;
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
	}

	.back-button {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: #e8a87c;
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	.back-button:hover {
		background: #d89968;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-content {
		background: white;
		border-radius: 16px;
		max-width: 900px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		padding: 2rem;
		position: relative;
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from {
			transform: translateY(30px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: #e8a87c;
		color: white;
		border: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.close-btn:hover {
		background: #d89968;
		transform: rotate(90deg);
	}

	.modal-content h2 {
		color: #2c2c2c;
		margin-bottom: 1.5rem;
		font-size: 1.75rem;
		padding-right: 3rem;
	}

	.detail-graph {
		margin-bottom: 2rem;
	}

	.stressor-list {
		padding: 1.5rem;
		background: #f5e6dc;
		border-radius: 12px;
	}

	.stressor-list h3 {
		color: #2c2c2c;
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.stressor-item {
		background: white;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 0.75rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.stressor-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.stressor-text {
		font-weight: 600;
		color: #2c2c2c;
		font-size: 1.05rem;
	}

	.intensity-badge {
		color: white;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: bold;
	}

	.stressor-mood {
		color: #6c5545;
		font-size: 0.9rem;
		font-style: italic;
	}

	@media (max-width: 768px) {
		.calendar-page {
			padding: 1rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.modal-content {
			padding: 1.5rem;
		}

		.modal-content h2 {
			font-size: 1.5rem;
		}
	}
</style>