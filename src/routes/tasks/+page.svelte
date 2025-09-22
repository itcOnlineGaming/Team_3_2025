<script>
	import { onDestroy } from 'svelte';
	import { selectedOption, selectedText } from '$lib/stores.js';
	
	let selected = null;
	let selectedWords = null;
	
	// Define the text for each option
	const optionTexts = {
		2: "Hello Bye",
		4: "Hello Bye Test One",
		6: "Hello Bye Test One Two Three"
	};
	
	// Subscribe to both stores
	const unsubscribeOption = selectedOption.subscribe(value => {
		selected = value;
	});
	
	const unsubscribeText = selectedText.subscribe(value => {
		selectedWords = value;
	});
	
	// Clean up subscriptions when component is destroyed
	onDestroy(() => {
		unsubscribeOption();
		unsubscribeText();
	});
	
	function selectOption(option) {
		selected = option;
		selectedWords = optionTexts[option];
		
		// Update both stores
		selectedOption.set(option);
		selectedText.set(optionTexts[option]);
	}
</script>

<div class="form-container">
	<h2>Select an Option</h2>
	
	<div class="button-group">
		<button 
			class="option-button {selected === 2 ? 'selected' : ''}"
			on:click={() => selectOption(2)}
		>
			2
		</button>
		
		<button 
			class="option-button {selected === 4 ? 'selected' : ''}"
			on:click={() => selectOption(4)}
		>
			4
		</button>
		
		<button 
			class="option-button {selected === 6 ? 'selected' : ''}"
			on:click={() => selectOption(6)}
		>
			6
		</button>
	</div>
	
	{#if selected}
		<div class="selection-info">
			<p class="selection-display">Selected: Option {selected}</p>
			{#if selectedWords}
				<p class="text-display">Text: "{selectedWords}"</p>
			{:else}
				<p class="text-display">No text for this option</p>
			{/if}
		</div>
	{:else}
		<p class="selection-display">No option selected</p>
	{/if}
</div>

<style>
	.form-container {
		max-width: 400px;
		margin: 2em auto;
		padding: 2em;
		text-align: center;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #f9f9f9;
	}
	
	.form-container h2 {
		margin-bottom: 1.5em;
		color: #333;
	}
	
	.button-group {
		display: flex;
		gap: 1em;
		justify-content: center;
		margin-bottom: 1.5em;
	}
	
	.option-button {
		width: 60px;
		height: 60px;
		border: 2px solid #ccc;
		background-color: white;
		border-radius: 8px;
		font-size: 1.5em;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.option-button:hover {
		border-color: #007bff;
		background-color: #f8f9ff;
	}
	
	.option-button.selected {
		border-color: #007bff;
		background-color: #007bff;
		color: white;
	}
	
	.selection-info {
		background-color: #e8f4f8;
		padding: 1em;
		border-radius: 6px;
		border-left: 4px solid #007bff;
	}
	
	.selection-display {
		font-size: 1.1em;
		color: #333;
		margin: 0 0 0.5em 0;
		font-weight: bold;
	}
	
	.text-display {
		font-size: 1em;
		color: #555;
		margin: 0;
		font-style: italic;
	}
</style>