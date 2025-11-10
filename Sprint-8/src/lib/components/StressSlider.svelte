<script lang="ts">
	interface Props {
		id: string;
		label?: string;
		value?: number;
		onchange?: (detail: { id: string; value: number }) => void;
	}

	let { id, label, value = $bindable(0), onchange }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const newValue = parseInt(target.value);
		value = newValue;
		onchange?.({ id, value: newValue });
	}
</script>

<div class="slider-container">
	{#if label}
		<div class="slider-label">{label}</div>
	{/if}
	
	<div class="slider-wrapper">
		<span class="slider-text">Stressed</span>
		
		<div class="slider-track">
			<input
				type="range"
				min="1"
				max="5"
				step="1"
				bind:value
				oninput={handleInput}
				class="slider"
				aria-label={label || 'Stress level'}
			/>
			<div class="tick-marks">
				{#each [5, 4, 3, 2, 1] as tick}
					<span class="tick">{tick}</span>
				{/each}
			</div>
		</div>
		
		<span class="slider-text">Not Stressed</span>
	</div>
</div>

<style>
	.slider-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.slider-label {
		font-weight: 500;
		font-size: 0.95rem;
		color: #333;
	}

	.slider-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.slider-text {
		font-size: 0.875rem;
		color: #666;
		white-space: nowrap;
	}

	.slider-track {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.slider {
		width: 100%;
		height: 13px;
		-webkit-appearance: none;
		appearance: none;
		background: #e0e0e0;
		border-radius: 4px;
		outline: none;
		cursor: pointer;
		direction: rtl;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		background: #38c93d;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		transition: transform 0.1s ease;
	}

	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}

	.slider::-moz-range-thumb {
		width: 24px;
		height: 24px;
		background: #4caf50;
		border-radius: 50%;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		transition: transform 0.1s ease;
	}

	.slider::-moz-range-thumb:hover {
		transform: scale(1.1);
	}

	.tick-marks {
		display: flex;
		justify-content: space-between;
		padding: 0 12px;
	}

	.tick {
		font-size: 0.75rem;
		color: #999;
		font-weight: 500;
	}
</style>