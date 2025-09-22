<script lang="ts">
	import { onMount } from 'svelte';
	let fontSize = '16';
	let darkMode = false;

	onMount(() => {
		const savedFont = localStorage.getItem('fontSize');
		const savedMode = localStorage.getItem('darkMode');
		if (savedFont) fontSize = savedFont;
		if (savedMode) darkMode = savedMode === 'true';
		applySettings();
	});

	function applySettings() {
		document.body.style.fontSize = fontSize + 'px';
		document.body.classList.toggle('dark', darkMode);
	}

	function handleFontSizeChange(e: Event) {
		fontSize = (e.target as HTMLSelectElement).value;
		localStorage.setItem('fontSize', fontSize);
		applySettings();
	}

	function toggleDarkMode() {
		darkMode = !darkMode;
		localStorage.setItem('darkMode', String(darkMode));
		applySettings();
	}
</script>

<header class="settings-header">
	<h1>Settings</h1>
</header>

<!-- Navigation Buttons -->
<nav class="nav-bar">
	<button><a href="/home">Home</a></button>
	<button><a href="/map">Map</a></button>
	<button><a href="/tasks">Tasks</a></button>
	<button><a href="/shop">Shop</a></button>
	<button><a href="/avatar">Avatar</a></button>
	<button><a href="/settings">Settings</a></button>
</nav>

<div class="settings-section">
	<div class="setting-item">
		<label for="font-size">Font Size:</label>
		<div class="custom-select-wrapper">
			<select id="font-size" bind:value={fontSize} on:change={handleFontSizeChange}>
				<option value="14">Small</option>
				<option value="16">Medium</option>
				<option value="20">Large</option>
				<option value="24">Extra Large</option>
			</select>
		</div>
	</div>

	<div class="setting-item">
		<label class="toggle-switch">
			<input type="checkbox" checked={darkMode} on:change={toggleDarkMode}>
			<span class="slider"></span>
		</label>
		<span class="toggle-label">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
	</div>
</div>

<style>
	:global(body.dark) {
		background: #222;
		color: #eee;
	}
	:global(body) {
		transition: background 0.3s, color 0.3s;
	}
	.settings-header {
		background: #000;
		color: #fff;
		padding: 1em 0;
		text-align: center;
		margin-bottom: 2em;
	}
	.nav-bar {
		display: flex;
		justify-content: center;
		gap: 1em;
		background: #1a237e;
		padding: 1em 0;
		border-radius: 10px;
		margin-bottom: 2em;
		box-shadow: 0 2px 12px rgba(26,35,126,0.08);
	}
	.nav-bar button {
		background: #3949ab;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 0.5em 1.2em;
		font-size: 1em;
		cursor: pointer;
		transition: background 0.2s, color 0.2s, box-shadow 0.2s;
		box-shadow: 0 2px 6px rgba(0,0,0,0.08);
	}
	.nav-bar button:hover {
		background: #5c6bc0;
		color: #ffd700;
	}
	.nav-bar a {
		color: inherit;
		text-decoration: none;
	}
	.settings-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2em;
		margin-bottom: 2em;
		background: #000;
		color: #fff;
		padding: 2em 0 2em 0;
		border-radius: 10px;
		box-shadow: 0 2px 12px rgba(0,0,0,0.08);
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
	}
	.setting-item {
		display: flex;
		align-items: center;
		gap: 1em;
	}
	.custom-select-wrapper select {
		padding: 0.4em 1.2em 0.4em 0.7em;
		border-radius: 4px;
		border: 1px solid #444;
		background: #222;
		color: #fff;
		font-size: 1em;
		appearance: none;
		outline: none;
		box-shadow: 0 2px 6px rgba(0,0,0,0.08);
	}
	.custom-select-wrapper {
		position: relative;
	}
	.custom-select-wrapper::after {
		content: '\25BC';
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: #fff;
	}
	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 28px;
	}
	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: .4s;
		border-radius: 28px;
	}
	.slider:before {
		position: absolute;
		content: "";
		height: 20px;
		width: 20px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: .4s;
		border-radius: 50%;
	}
	.toggle-switch input:checked + .slider {
		background-color: #3949ab;
	}
	.toggle-switch input:checked + .slider:before {
		transform: translateX(20px);
	}
	.toggle-label {
		margin-left: 0.7em;
		font-size: 1em;
	}
</style>



