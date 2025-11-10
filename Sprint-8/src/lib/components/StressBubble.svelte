<script lang="ts">
	interface Props {
		text: string;
		intensity: number; // 1-5 from the slider
		mood?: string; // optional: the selected mood color
		x?: number; // position for graph placement
		y?: number; // position for graph placement
	}

	let { text, intensity, mood, x = 50, y = 50 }: Props = $props();

	// Calculate bubble size based on intensity (1-5 scale)
	const size = intensity * 20 + 40; // 60px to 140px range
	
	// Color based on intensity (stressed = red, not stressed = green)
	const colors = {
		1: '#9ACD32', // Not stressed - green
		2: '#FFD700', // yellow
		3: '#FFA500', // orange
		4: '#FF69B4', // pink
		5: '#E91E63'  // Stressed - red
	};
	
	const bubbleColor = colors[intensity as keyof typeof colors] || '#FFA500';
</script>

<div 
	class="bubble" 
	style="
		width: {size}px; 
		height: {size}px; 
		background-color: {bubbleColor};
		left: {x}%;
		top: {y}%;
	"
	title={text}
>
	<span class="bubble-text">{text}</span>
	<span class="intensity-badge">{intensity}</span>
</div>

<style>
	.bubble {
		position: absolute;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		cursor: pointer;
		transition: transform 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translate(-50%, -50%);
	}

	.bubble:hover {
		transform: translate(-50%, -50%) scale(1.1);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	}

	.bubble-text {
		position: absolute;
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
		text-align: center;
		word-wrap: break-word;
		max-width: 80%;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.intensity-badge {
		position: absolute;
		top: -8px;
		right: -8px;
		background: white;
		color: #333;
		font-size: 0.75rem;
		font-weight: bold;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}
</style>