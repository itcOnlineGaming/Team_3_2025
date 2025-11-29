<script lang="ts">
	import type { DayEntry } from '$lib/stores/calendarStore';

	interface Props {
		dayNumber: number;
		entry: DayEntry | null;
		isCurrentMonth: boolean;
		isToday: boolean;
		onclick?: () => void;
	}

	let { dayNumber, entry, isCurrentMonth, isToday, onclick }: Props = $props();

	// Calculate average intensity for the day
	const averageIntensity = $derived.by(() => {
		if (!entry || entry.stressors.length === 0) return 0;
		const sum = entry.stressors.reduce((acc, s) => acc + s.intensity, 0);
		return sum / entry.stressors.length;
	});

	// Get color based on average intensity
	const dayColor = $derived.by(() => {
		if (!entry) return 'transparent';
		
		if (averageIntensity >= 4.5) return '#E91E63'; // Stressed - red
		if (averageIntensity >= 3.5) return '#FF69B4'; // pink
		if (averageIntensity >= 2.5) return '#FFA500'; // orange
		if (averageIntensity >= 1.5) return '#FFD700'; // yellow
		return '#9ACD32'; // Not stressed - green
	});
</script>

<button 
	class="calendar-day" 
	class:current-month={isCurrentMonth}
	class:today={isToday}
	class:has-entry={entry !== null}
	onclick={onclick}
	type="button"
	aria-label={`Day ${dayNumber}${entry ? `, ${entry.stressors.length} stressors` : ''}`}
>
	<div class="day-number">{dayNumber}</div>
	
	{#if entry && entry.stressors.length > 0}
		<div class="indicator-row">
			{#each entry.stressors.slice(0, 3) as stressor}
				<div 
					class="mini-indicator"
					style="background-color: {dayColor};"
					title={stressor.text}
				></div>
			{/each}
			{#if entry.stressors.length > 3}
				<div class="more-count">+{entry.stressors.length - 3}</div>
			{/if}
		</div>
	{/if}
</button>

<style>
	.calendar-day {
		aspect-ratio: 1;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 80px;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.calendar-day:not(.current-month) {
		opacity: 0.3;
		background: #f5f5f5;
	}

	.calendar-day.today {
		border: 2px solid #e8a87c;
		background: #fef5ee;
	}

	.calendar-day.has-entry:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 10;
	}

	.day-number {
		font-size: 0.9rem;
		font-weight: 600;
		color: #2c2c2c;
		margin-bottom: 4px;
	}

	.indicator-row {
		display: flex;
		gap: 3px;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin-top: auto;
	}

	.mini-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		opacity: 0.8;
	}

	.more-count {
		font-size: 0.7rem;
		font-weight: 600;
		color: #666;
		background: rgba(0, 0, 0, 0.05);
		padding: 2px 4px;
		border-radius: 4px;
	}

	@media (max-width: 600px) {
		.calendar-day {
			min-height: 60px;
			padding: 4px;
		}

		.day-number {
			font-size: 0.75rem;
		}

		.mini-indicator {
			width: 8px;
			height: 8px;
		}
	}
</style>