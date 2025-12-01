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
		onIntensityChange?: (id: string, newIntensity: number) => void;
		readonly?: boolean;
		children?: any;
	}

	let { stressors = [], date = new Date(), onIntensityChange, onRemove, readonly = false, children }: Props = $props();

	// Improved bubble placement with dynamic collision detection
	function generatePositions(stressorsList: Stressor[]) {
		const count = stressorsList.length;
		if (count === 0) return [];
		
		const positions: Array<{x: number, y: number, radius: number}> = [];
		const containerSize = 500;
		const margin = 12;
		const minSpacing = 12;
		
		// Reduced max size - now 60px to 120px instead of 60px to 140px
		const getBubbleRadius = (stressor: Stressor) => {
			const sizePixels = stressor.intensity * 16 + 44; // Adjusted formula
			return (sizePixels / 2 / containerSize) * 100;
		};

		const hasCollision = (x: number, y: number, r: number) => {
			// Check bounds
			if (x - r < margin || x + r > 100 - margin) return true;
			if (y - r < margin || y + r > 100 - margin) return true;

			// Check collisions with existing bubbles
			for (const pos of positions) {
				const dx = x - pos.x;
				const dy = y - pos.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const minDistance = r + pos.radius + (minSpacing / containerSize * 100);
				if (distance < minDistance) return true;
			}
			return false;
		};

		// Try to place bubble near existing ones
		const findValidPosition = (radius: number, attempts: number = 150): {x: number, y: number} | null => {
			if (positions.length === 0) {
				// First bubble - center it
				return { x: 50, y: 50 };
			}

			// Try placing near existing bubbles first
			for (let attempt = 0; attempt < attempts; attempt++) {
				let x: number, y: number;
				
				if (attempt < attempts * 0.7) {
					// First 70% of attempts: place near existing bubbles
					const refBubble = positions[Math.floor(Math.random() * positions.length)];
					const angle = Math.random() * Math.PI * 2;
					const distance = refBubble.radius + radius + (minSpacing / containerSize * 100) + 5 + (Math.random() * 10);
					
					x = refBubble.x + Math.cos(angle) * distance;
					y = refBubble.y + Math.sin(angle) * distance;
				} else {
					// Last 30% of attempts: random placement
					x = margin + radius + Math.random() * (100 - 2 * margin - 2 * radius);
					y = margin + radius + Math.random() * (100 - 2 * margin - 2 * radius);
				}

				if (!hasCollision(x, y, radius)) {
					return { x, y };
				}
			}

			return null;
		};

		// Place bubbles one by one
		for (let i = 0; i < count; i++) {
			const radius = getBubbleRadius(stressorsList[i]);
			const position = findValidPosition(radius);
			
			if (position) {
				positions.push({ ...position, radius });
			} else {
				// Fallback: force placement in a grid
				const cols = Math.ceil(Math.sqrt(count));
				const row = Math.floor(i / cols);
				const col = i % cols;
				const cellWidth = (100 - 2 * margin) / cols;
				const cellHeight = (100 - 2 * margin) / Math.ceil(count / cols);
				const x = margin + col * cellWidth + cellWidth / 2;
				const y = margin + row * cellHeight + cellHeight / 2;
				positions.push({ x, y, radius });
			}
		}

		return positions;
	}

	// Make positions reactive to stressors changes
	const positions = $derived.by(() => generatePositions(stressors));
	
	function handleIntensityChange(id: string, newIntensity: number) {
		if (!readonly && onIntensityChange) {
			onIntensityChange(id, newIntensity);
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
					x={positions[i]?.x || 50}
					y={positions[i]?.y || 50}
					onIntensityChange={(newIntensity) => handleIntensityChange(stressor.id, newIntensity)}
					readonly={readonly}
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
		{#if !readonly}
			<p class="legend-note">Size represents stress intensity. Hover over bubbles to adjust intensity with + (increase) or − (decrease). At intensity 1, click 💥 to pop the bubble!</p>
		{/if}
	</div>

	{#if children}
		<div class="action-buttons-container">
			{@render children()}
		</div>
	{/if}
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
		padding: 1rem;
		background: transparent;
		border-radius: 8px;
	}

	.legend h3 {
		font-size: 1rem;
		margin-bottom: 0.75rem;
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
		background-color: #E91E63;
	}

	.legend-bubble.moderate {
		background-color: #FFA500;
	}

	.legend-bubble.calm {
		background-color: #9ACD32;
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

	.action-buttons-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin: 1.5rem 0;
		flex-wrap: wrap;
	}

	@media (max-width: 600px) {
		.action-buttons-container {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>