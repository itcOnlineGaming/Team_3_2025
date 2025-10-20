<script lang="ts">
	import ImportanceRating from '$lib/components/ImportanceRating.svelte';

	let rating1 = $state(0);
	let rating2 = $state(3);
	let rating3 = $state(0);
	let rating4 = $state(0);

	let checklistItems = $state([
		{ id: '1', label: 'Complete project setu', done: false },
		{ id: '2', label: 'Write documentation', done: true },
		{ id: '3', label: 'Create unit tests', done: false },
		{ id: '4', label: 'Review code', done: false },
		{ id: '5', label: 'Deploy to production', done: false }
	]);

	function handleRatingChange(detail: { id: string; value: number }) {
		console.log('Rating changed:', detail);
	}
</script>

<div class="container">
	<h1>Component Testing Page</h1>

	<section class="section">
		<h2>Importance Rating Component</h2>
		
		<div class="demo-group">
			<ImportanceRating
				id="rating1"
				label="What made you stressed?"
				bind:value={rating1}
				onchange={handleRatingChange}
			/>
			<p class="value-display">Selected value: {rating1}</p>
		</div>
	</section>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2rem;
		color: #333;
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.5rem;
		color: #444;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid #4caf50;
		padding-bottom: 0.5rem;
	}

	h3 {
		font-size: 1.125rem;
		color: #555;
		margin-bottom: 0.5rem;
	}

	.section {
		margin-bottom: 3rem;
		padding: 1.5rem;
		background: #f9f9f9;
		border-radius: 0.5rem;
	}

	.demo-group {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.value-display {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background: #e8f5e9;
		border-left: 4px solid #4caf50;
		font-family: monospace;
		font-size: 0.875rem;
		color: #2e7d32;
	}
</style>