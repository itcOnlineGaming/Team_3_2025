<script lang="ts">
	import StressBubble from './StressBubble.svelte';

	interface Stressor {
		id: string;
		text: string;
		intensity: number;
		mood?: string;
	}

	interface Props {
		stressors: Stressor[];
		date?: Date;
		onRemove?: (id: string) => void;
	}

	let { stressors = [], date = new Date(), onRemove }: Props = $props();

	// Generate random but consistent positions for bubbles
	function generatePositions(count: number) {
		const positions = [];
		const margin = 15;
		
		for (let i = 0; i < count; i++) {
			const angle = (i / count) * Math.PI * 2;
			const radius = 25 + (i % 2) * 15;
			const x = 50 + Math.cos(angle) * radius;
			const y = 50 + Math.sin(angle) * radius;
			
			positions.push({
				x: Math.max(margin, Math.min(100 - margin, x)),
				y: Math.max(margin, Math.min(100 - margin, y))
			});
		}
		
		return positions;
	}

	const positions = $derived(generatePositions(stressors.length));
	
	function handleBubbleClick(id: string) {
		if (onRemove) {
			onRemove(id);
		}
	}
</script>

<div class="graph-container">
	<div class="graph-header">
		<h2>Bubble Graph</h2>
		<p class="date">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
	</div>

	<div class="bubble-area">
		{#if stressors.length === 0}
			<div class="empty-state">
				<p>No stressors tracked yet today</p>
			</div>
		{:else}
			{#each stressors as stressor, i (stressor.id)}
				<StressBubble
					text={stressor.text}
					intensity={stressor.intensity}
					mood={stressor.mood}
					x={positions[i].x}
					y={positions[i].y}
					onclick={() => handleBubbleClick(stressor.id)}
				/>
			{/each}
		{/if}
	</div>

	<div class="legend">
		<h3>Stress Intensity</h3>
		<div class="legend-items">
			<div class="legend-item">
				<div class="legend-bubble stressed"></div>
				<span>Stressed</span>
			</div>
			<div class="legend-item">
				<div class="legend-bubble moderate"></div>
				<span>Moderate</span>
			</div>
			<div class="legend-item">
				<div class="legend-bubble calm"></div>
				<span>Calm</span>
			</div>
		</div>
		<p class="legend-note">Size represents stress intensity <br>Click The Stress Bubbles to remove <br> Click the plus to add a stress bubble</p>
	</div>
</div>

<style>
	.graph-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		background: #f5e6dc;
		border-radius: 12px;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.graph-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.graph-header h2 {
		font-size: 1.75rem;
		color: #2c2c2c;
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.date {
		color: #6c5545;
		font-size: 0.95rem;
		font-style: italic;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.bubble-area {
		position: relative;
		width: 100%;
		height: 500px;
		background: #fef5ee;
		border: 3px solid #e8a87c;
		border-radius: 20px;
		margin-bottom: 2rem;
		overflow: hidden;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #999;
		font-size: 1.1rem;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.legend {
		background: transparent;
		border-radius: 8px;
	}

	.legend h3 {
		font-size: 1rem;
		margin-bottom: 0.5rem;
		color: #2c2c2c;
		font-weight: 600;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.legend-items {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-bottom: 0.5rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.legend-bubble {
		width: 20px;
		height: 20px;
		border-radius: 50%;
	}

	.legend-bubble.stressed {
		background-color: #e8928e;
	}

	.legend-bubble.moderate {
		background-color: #f4d49d;
	}

	.legend-bubble.calm {
		background-color: #b8d89f;
	}

	.legend-note {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		color: #6c5545;
		font-style: italic;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	@media (max-width: 600px) {
		.bubble-area {
			height: 400px;
		}

		.legend-items {
			flex-direction: column;
			gap: 0.75rem;
		}
	}
</style>