<script lang="ts">
	interface Props {
		id: string;
		label?: string;
		value?: number;
		onchange?: (detail: { id: string; value: number }) => void;
	}

	let { id, label, value = $bindable(0), onchange }: Props = $props();

	function handleClick(rating: number) {
		value = rating;
		onchange?.({ id, value: rating });
	}
</script>

<div class="rating-container">
	{#if label}
		<div class="rating-label">{label}</div>
	{/if}
	
	<div class="rating-wrapper">
		<span class="rating-text">Stressful</span>
		
		<div class="rating-boxes">
			{#each [5, 4, 3, 2, 1] as rating}
				<button
					type="button"
					class="rating-box {value === rating ? 'selected' : ''}"
					onclick={() => handleClick(rating)}
					aria-label="Rating {rating} of 5"
					data-testid="rating-{rating}"
				>
					{rating}
				</button>
			{/each}
		</div>
		
		<span class="rating-text">Not Stressful</span>
	</div>
</div>

<style>
	.rating-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.rating-label {
		font-weight: 500;
		font-size: 0.95rem;
		color: #333;
	}

	.rating-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.rating-text {
		font-size: 0.875rem;
		color: #666;
		white-space: nowrap;
	}

	.rating-boxes {
		display: flex;
		gap: 0.5rem;
		flex: 1;
		justify-content: center;
	}

	.rating-box {
		width: 48px;
		height: 48px;
		border: 2px solid #ccc;
		border-radius: 0.375rem;
		background: white;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 600;
		color: #666;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.rating-box.selected {
		border-color: #4caf50;
		background: #4caf50;
		color: white;
		box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
	}

	.rating-box:active {
		transform: translateY(0);
	}
</style>