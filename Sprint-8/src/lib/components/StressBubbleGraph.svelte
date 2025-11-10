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
	}

	let { stressors = [], date = new Date() }: Props = $props();

	// Generate random but consistent positions for bubbles
	// Using a simple layout algorithm to avoid overlap
	function generatePositions(count: number) {
		const positions = [];
		const margin = 15; // margin from edges
		
		for (let i = 0; i < count; i++) {
			// Simple grid-like placement with some randomness
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
</script>

<div class="graph-container">
	<div class="graph-header">
		<h2>Your Stress Map</h2>
		<p class="date">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
	</div>

	<div class="bubble-area">
		{#if stressors.length === 0}
			<div class="empty-state">
				<p>No stressors tracked yet today</p>
			</div>
		{:else}
			{#each stressors as stressor, i}
				<StressBubble
					text={stressor.text}
					intensity={stressor.intensity}
					mood={stressor.mood}
					x={positions[i].x}
					y={positions[i].y}
				/>
			{/each}
		{/if}
	</div>

	<div class="legend">
		<h3>Stress Intensity</h3>
		<div class="legend-items">
			<div class="legend-item">
				<div class="legend-bubble" style="background-color: #9ACD32;"></div>
				<span>1 - Not Stressed</span>
			</div>
			<div class="legend-item">
				<div class="legend-bubble" style="background-color: #FFA500;"></div>
				<span>3 - Moderate</span>
			</div>
			<div class="legend-item">
				<div class="legend-bubble" style="background-color: #E91E63;"></div>
				<span>5 - Very Stressed</span>
			</div>
		</div>
		<p class="legend-note">Bubble size reflects intensity level</p>
	</div>
</div>

<style>
	.graph-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.graph-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.graph-header h2 {
		font-size: 1.75rem;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.date {
		color: #666;
		font-size: 0.95rem;
	}

	.bubble-area {
		position: relative;
		width: 100%;
		height: 500px;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		border-radius: 12px;
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
	}

	.legend {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 8px;
	}

	.legend h3 {
		font-size: 1rem;
		margin-bottom: 0.75rem;
		color: #333;
	}

	.legend-items {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.legend-bubble {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.legend-note {
		margin-top: 0.75rem;
		font-size: 0.85rem;
		color: #666;
		font-style: italic;
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