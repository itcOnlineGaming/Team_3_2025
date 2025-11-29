<script lang="ts">
	import CalendarDay from './CalendarDay.svelte';
	import { calendarStore, type DayEntry } from '$lib/stores/calendarStore';

	interface Props {
		onDayClick?: (date: Date, entry: DayEntry | null) => void;
	}

	let { onDayClick }: Props = $props();

	// Subscribe to store for reactivity
	let calendarData = $state($calendarStore);
	
	$effect(() => {
		calendarData = $calendarStore;
	});

	let currentDate = $state(new Date());

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Get calendar grid data
	const days = $derived.by(() => {
        const _ = calendarData;
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		
		const firstDay = new Date(year, month, 1);
		const firstDayOfWeek = firstDay.getDay();
		
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		
		const prevMonthLastDay = new Date(year, month, 0);
		const prevMonthDays = prevMonthLastDay.getDate();
		
		const result: Array<{
			date: Date;
			dayNumber: number;
			isCurrentMonth: boolean;
			isToday: boolean;
			entry: DayEntry | null;
		}> = [];
		
		// Add previous month days
		for (let i = firstDayOfWeek - 1; i >= 0; i--) {
			const date = new Date(year, month - 1, prevMonthDays - i);
			result.push({
				date,
				dayNumber: prevMonthDays - i,
				isCurrentMonth: false,
				isToday: false,
				entry: calendarStore.getEntry(date)
			});
		}
		
		// Add current month days
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(year, month, day);
			date.setHours(0, 0, 0, 0);
			
			result.push({
				date,
				dayNumber: day,
				isCurrentMonth: true,
				isToday: date.getTime() === today.getTime(),
				entry: calendarStore.getEntry(date)
			});
		}
		
		// Add next month days
		const remainingDays = 42 - result.length;
		for (let day = 1; day <= remainingDays; day++) {
			const date = new Date(year, month + 1, day);
			result.push({
				date,
				dayNumber: day,
				isCurrentMonth: false,
				isToday: false,
				entry: calendarStore.getEntry(date)
			});
		}
		
		return result;
	});

	function previousMonth() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
	}

	function nextMonth() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
	}

	function goToToday() {
		currentDate = new Date();
	}

	function handleDayClick(date: Date, entry: DayEntry | null) {
		if (onDayClick) {
			onDayClick(date, entry);
		}
	}

	function handleClearMonth() {
		if (confirm('Are you sure you want to clear all entries for this month?')) {
			calendarStore.clearMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
		}
	}
</script>

<div class="calendar-container">
	<div class="calendar-header">
		<div class="header-left">
			<h2 class="month-year">
				{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
			</h2>
		</div>
		
		<div class="header-controls">
			<button class="control-btn" onclick={previousMonth} type="button">
				<span>←</span>
			</button>
			<button class="control-btn today-btn" onclick={goToToday} type="button">
				Today
			</button>
			<button class="control-btn" onclick={nextMonth} type="button">
				<span>→</span>
			</button>
		</div>

		<button class="clear-btn" onclick={handleClearMonth} type="button">
			Clear Month
		</button>
	</div>

	<div class="calendar-grid">
		<div class="day-names">
			{#each dayNames as dayName}
				<div class="day-name">{dayName}</div>
			{/each}
		</div>

		<div class="days-grid">
			{#each days as day (day.date.toISOString())}
				<CalendarDay
					dayNumber={day.dayNumber}
					entry={day.entry}
					isCurrentMonth={day.isCurrentMonth}
					isToday={day.isToday}
					onclick={() => handleDayClick(day.date, day.entry)}
				/>
			{/each}
		</div>
	</div>

	<div class="calendar-legend">
		<h3>Stress Levels</h3>
		<div class="legend-items">
			<div class="legend-item">
				<div class="legend-color" style="background: #9ACD32;"></div>
				<span>Calm</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background: #FFD700;"></div>
				<span>Low</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background: #FFA500;"></div>
				<span>Moderate</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background: #FF69B4;"></div>
				<span>High</span>
			</div>
			<div class="legend-item">
				<div class="legend-color" style="background: #E91E63;"></div>
				<span>Very High</span>
			</div>
		</div>
	</div>
</div>

<style>
	.calendar-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		background: #f5e6dc;
		border-radius: 12px;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.header-left {
		flex: 1;
		min-width: 200px;
	}

	.month-year {
		font-size: 1.75rem;
		color: #2c2c2c;
		font-weight: 600;
		margin: 0;
	}

	.header-controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.control-btn {
		padding: 0.5rem 1rem;
		background: white;
		border: 2px solid #e8a87c;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		color: #6c5545;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.control-btn:hover {
		background: #e8a87c;
		color: white;
	}

	.today-btn {
		padding: 0.5rem 1.5rem;
	}

	.clear-btn {
		padding: 0.5rem 1rem;
		background: #ff6b6b;
		border: none;
		border-radius: 8px;
		color: white;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.clear-btn:hover {
		background: #ee5555;
	}

	.calendar-grid {
		background: #fef5ee;
		border: 3px solid #e8a87c;
		border-radius: 12px;
		padding: 1rem;
	}

	.day-names {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.day-name {
		text-align: center;
		font-weight: 600;
		color: #6c5545;
		font-size: 0.9rem;
		padding: 0.5rem;
	}

	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
	}

	.calendar-legend {
		margin-top: 2rem;
		padding: 1rem;
		background: transparent;
	}

	.calendar-legend h3 {
		font-size: 1rem;
		margin-bottom: 0.75rem;
		color: #2c2c2c;
		font-weight: 600;
	}

	.legend-items {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.legend-color {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 768px) {
		.calendar-container {
			padding: 1rem;
		}

		.calendar-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.month-year {
			font-size: 1.5rem;
		}

		.header-controls {
			width: 100%;
			justify-content: space-between;
		}

		.clear-btn {
			width: 100%;
		}

		.calendar-grid {
			padding: 0.5rem;
		}

		.day-names {
			gap: 0.25rem;
		}

		.days-grid {
			gap: 0.25rem;
		}

		.day-name {
			font-size: 0.75rem;
			padding: 0.25rem;
		}

		.legend-items {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>