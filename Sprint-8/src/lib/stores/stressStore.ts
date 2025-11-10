import { writable } from 'svelte/store';

export interface Stressor {
	id: string;
	text: string;
	intensity: number;
	mood: string;
	timestamp: Date;
}

// Create a writable store with an array of stressors
function createStressStore() {
	const { subscribe, set, update } = writable<Stressor[]>([]);

	return {
		subscribe,
		addStressor: (text: string, intensity: number, mood: string) => {
			const newStressor: Stressor = {
				id: crypto.randomUUID(),
				text,
				intensity,
				mood,
				timestamp: new Date()
			};
			update(stressors => [...stressors, newStressor]);
		},
		clearToday: () => set([]),
		reset: () => set([])
	};
}

export const stressStore = createStressStore();