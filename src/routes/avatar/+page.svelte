<script lang="ts">
import { HAT_TYPES, type HatType } from '../../lib/hattypes';
import { playerInventory, equipHat } from '../../lib/hatstores/playerinventory';
import { writable } from 'svelte/store';

// Local state for selected hat
let selectedHat: string | null = playerInventory.equippedHat ?? null;
let confirmMessage = '';

function selectHat(hatId: string) {
	selectedHat = hatId;
	confirmMessage = '';
}

function confirmEquip() {
	if (selectedHat) {
		equipHat(selectedHat);
		confirmMessage = 'Hat equipped!';
	}
}
</script>

<header class="avatar-header">
	<h1>Avatar Customization</h1>
</header>

<div class="customization-container">
	<div class="player-preview">
		<div class="player-model">
			<div class="player-head">
				{#if selectedHat}
					<img src={HAT_TYPES.find(h => h.id === selectedHat)?.image} alt="Selected Hat" class="hat-img" />
				{/if}
			</div>
			<div class="player-body"></div>
		</div>
		<div class="equipped-label">
			{selectedHat ? HAT_TYPES.find(h => h.id === selectedHat)?.name : 'No Hat Selected'}
		</div>
	</div>

	<div class="hat-selection">
		<h2>Select a Hat</h2>
		<div class="hat-list">
			{#each HAT_TYPES.filter(h => playerInventory.ownedHats.includes(h.id)) as hat}
				<button class:selected={selectedHat === hat.id} on:click={() => selectHat(hat.id)}>
					<img src={hat.image} alt={hat.name} class="hat-thumb" />
					<span>{hat.name}</span>
				</button>
			{/each}
		</div>
		<button class="equip-btn" on:click={confirmEquip} disabled={!selectedHat}>Equip</button>
		{#if confirmMessage}
			<div class="confirm-message">{confirmMessage}</div>
		{/if}
	</div>
</div>

<style>
.avatar-header {
	background: linear-gradient(90deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%);
	color: #fff;
	padding: 1.5em 0 1em 0;
	text-align: center;
	border-radius: 0 0 18px 18px;
	margin-bottom: 2em;
	box-shadow: 0 2px 12px rgba(25, 118, 210, 0.10);
}
.customization-container {
	display: flex;
	gap: 2.5em;
	justify-content: center;
	align-items: flex-start;
	margin-top: 2em;
	background: #fff;
	border-radius: 18px;
	box-shadow: 0 4px 24px rgba(25, 118, 210, 0.10);
	padding: 2em 2.5em;
}
.player-preview {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1em;
}
.player-model {
	width: 120px;
	height: 200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #e3f2fd;
	border-radius: 18px;
	box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
	padding: 1em 0;
}
.player-head {
	width: 70px;
	height: 70px;
	background: #ffe0b2;
	border-radius: 50%;
	position: relative;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.hat-img {
	position: absolute;
	top: -32px;
	left: 50%;
	transform: translateX(-50%) scale(1.5);
	width: 70px;
	height: 44px;
	object-fit: contain;
	z-index: 2;
	transition: transform 0.2s;
}
.player-body {
	width: 48px;
	height: 110px;
	background: #90caf9;
	border-radius: 24px;
	margin-top: -10px;
	box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}
.equipped-label {
	margin-top: 0.7em;
	font-weight: bold;
	color: #3949ab;
	font-size: 1.1em;
}
.hat-selection {
	min-width: 240px;
	background: #f5f5f5;
	border-radius: 12px;
	padding: 1.5em 1.2em;
	box-shadow: 0 2px 8px rgba(25, 118, 210, 0.06);
}
.hat-selection h2 {
	margin-bottom: 1em;
	color: #3949ab;
	font-size: 1.2em;
	text-align: center;
}
.hat-list {
	display: flex;
	gap: 1em;
	flex-wrap: wrap;
	margin-bottom: 1em;
	justify-content: center;
}
.hat-list button {
	background: #e3e3e3;
	border: 2px solid transparent;
	border-radius: 8px;
	padding: 0.5em 0.7em;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.3em;
	cursor: pointer;
	transition: border 0.2s, background 0.2s, box-shadow 0.2s;
	box-shadow: 0 1px 4px rgba(25, 118, 210, 0.06);
}
.hat-list button.selected, .hat-list button:hover {
	border: 2px solid #3949ab;
	background: #e8eaf6;
	box-shadow: 0 2px 8px rgba(25, 118, 210, 0.10);
}
.hat-thumb {
	width: 44px;
	height: 32px;
	object-fit: contain;
}
.equip-btn {
	margin-top: 1em;
	background: linear-gradient(90deg, #3949ab 0%, #1976d2 100%);
	color: #fff;
	border: none;
	border-radius: 8px;
	padding: 0.7em 2em;
	font-size: 1.1em;
	cursor: pointer;
	transition: background 0.2s, box-shadow 0.2s;
	box-shadow: 0 2px 8px rgba(25, 118, 210, 0.10);
	font-weight: bold;
	letter-spacing: 0.5px;
}
.equip-btn:disabled {
	background: #aaa;
	cursor: not-allowed;
	box-shadow: none;
}
.confirm-message {
	margin-top: 0.7em;
	color: #388e3c;
	font-weight: bold;
	text-align: center;
}
</style>
