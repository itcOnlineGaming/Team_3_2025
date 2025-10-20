import type { HatType } from '../hattypes';

// Player inventory and equipped hat
export type PlayerInventory = {
	ownedHats: string[]; // array of hat ids
	equippedHat: string | null;
};

// Example: default inventory (could be loaded from storage/server)
export let playerInventory: PlayerInventory = {
	ownedHats: ['baseball', 'top', 'beanie'],
	equippedHat: null,
};

export function equipHat(hatId: string) {
	if (playerInventory.ownedHats.includes(hatId)) {
		playerInventory.equippedHat = hatId;
	}
}
