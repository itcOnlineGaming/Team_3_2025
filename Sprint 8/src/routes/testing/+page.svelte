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