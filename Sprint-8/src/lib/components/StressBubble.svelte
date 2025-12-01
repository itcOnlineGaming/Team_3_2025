<script lang="ts">
	interface Props {
		text: string;
		intensity: number;
		mood?: string;
		x?: number;
		y?: number;
		onIntensityChange?: (newIntensity: number) => void;
		readonly?: boolean;
	}

	let { text, intensity, mood, x = 50, y = 50, onIntensityChange, readonly = false }: Props = $props();

	let isHovered = $state(false);
	let hoverTimeout: number | null = null;
	let isPopping = $state(false);

	// Reduced size calculation - now 60px to 120px instead of 60px to 140px
	const size = $derived(intensity * 16 + 44);
	
	const colors = {
		1: '#9ACD32',
		2: '#FFD700',
		3: '#FFA500',
		4: '#FF69B4',
		5: '#E91E63'
	};
	
	const bubbleColor = $derived(colors[intensity as keyof typeof colors] || '#FFA500');

	function handleMouseEnter() {
		if (readonly) return;
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}
		isHovered = true;
	}

	function handleMouseLeave() {
		if (readonly) return;
		hoverTimeout = window.setTimeout(() => {
			isHovered = false;
		}, 100);
	}

	function handleIncreaseClick(e: MouseEvent) {
		if (readonly) return;
		e.stopPropagation();
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}
		if (intensity < 5 && onIntensityChange) {
			onIntensityChange(intensity + 1);
		}
	}

	function handleDecreaseClick(e: MouseEvent) {
		if (readonly) return;
		e.stopPropagation();
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
		}
		
		if (intensity > 1 && onIntensityChange) {
			onIntensityChange(intensity - 1);
		} else if (intensity === 1 && onIntensityChange) {
			// Pop the bubble when intensity is 1 and decrease is clicked
			isPopping = true;
			setTimeout(() => {
				onIntensityChange(0);
			}, 300); // Wait for animation to complete
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="bubble-wrapper"
	class:popping={isPopping}
	style="left: {x}%; top: {y}%;"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role="button"
	tabindex="0"
	aria-label={`Stressor: ${text}, intensity ${intensity}`}
>
	<div 
		class="bubble" 
		style="
			width: {size}px; 
			height: {size}px; 
			background-color: {bubbleColor};
		"
		title={text}
	>
		<span class="bubble-text">{text}</span>
		<span class="intensity-badge">{intensity}</span>
		
		{#if isHovered && !readonly && !isPopping}
			<button 
				class="control-button increase-button" 
				onclick={handleIncreaseClick}
				onmouseenter={handleMouseEnter}
				title="Increase intensity"
				type="button"
				aria-label="Increase intensity"
				disabled={intensity >= 5}
				class:disabled={intensity >= 5}
			>
				<span class="control-icon">+</span>
			</button>
			
			<button 
				class="control-button decrease-button" 
				onclick={handleDecreaseClick}
				onmouseenter={handleMouseEnter}
				title={intensity === 1 ? "Pop bubble" : "Decrease intensity"}
				type="button"
				aria-label={intensity === 1 ? "Pop bubble" : "Decrease intensity"}
			>
				<span class="control-icon">{intensity === 1 ? '💥' : '−'}</span>
			</button>
		{/if}
	</div>
</div>

<style>
	.bubble-wrapper {
		position: absolute;
		transform: translate(-50%, -50%);
		z-index: 1;
		transition: opacity 0.3s ease, transform 0.3s ease;
	}

	.bubble-wrapper:hover {
		z-index: 100;
	}

	.bubble-wrapper.popping {
		animation: pop 0.3s ease forwards;
	}

	@keyframes pop {
		0% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
		50% {
			transform: translate(-50%, -50%) scale(1.3);
			opacity: 0.8;
		}
		100% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
	}

	.bubble {
		position: relative;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.bubble-wrapper:hover .bubble {
		transform: scale(1.1);
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
		pointer-events: none;
		font-family: BlinkMacSystemFont, -apple-system, sans-serif;
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
		pointer-events: none;
	}

	.control-button {
		position: absolute;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 3px solid white;
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
		transition: all 0.2s ease;
		animation: popIn 0.2s ease;
		z-index: 10;
		padding: 0;
		font-weight: bold;
	}

	.increase-button {
		background: #4CAF50;
		top: -12px;
		right: -12px;
	}

	.increase-button:hover:not(.disabled) {
		background: #45a049;
		transform: scale(1.15);
		box-shadow: 0 4px 12px rgba(76, 175, 80, 0.6);
	}

	.decrease-button {
		background: #ff9800;
		top: -12px;
		left: -12px;
	}

	.decrease-button:hover {
		background: #e68900;
		transform: scale(1.15);
		box-shadow: 0 4px 12px rgba(255, 152, 0, 0.6);
	}

	.control-button.disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: #999;
	}

	.control-button:active:not(.disabled) {
		transform: scale(1.05);
	}

	.control-icon {
		font-size: 1.5rem;
		font-weight: bold;
		line-height: 1;
		user-select: none;
	}

	@keyframes popIn {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>