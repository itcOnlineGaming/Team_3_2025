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
			console.log('Adding stressor:', newStressor);
			update(stressors => {
				const updated = [...stressors, newStressor];
				console.log('Updated stressors:', updated);
				return updated;
			});
		},
		updateIntensity: (id: string, newIntensity: number) => {
			console.log('Updating intensity:', id, newIntensity);
			update(stressors => {
				if (newIntensity <= 0) {
					// Remove stressor if intensity is 0 or below
					console.log('Removing stressor with id:', id);
					return stressors.filter(s => s.id !== id);
				}
				// Update the intensity
				const updated = stressors.map(s => 
					s.id === id ? { ...s, intensity: newIntensity } : s
				);
				console.log('Updated stressors after intensity change:', updated);
				return updated;
			});
		},
		remove: (id: string) => {
			update(stressors => stressors.filter(s => s.id !== id));
		},
		loadStressors: (stressors: Stressor[]) => {
			// Load existing stressors without triggering adds
			console.log('Loading stressors:', stressors);
			set(stressors);
		},
		clearToday: () => set([]),
		reset: () => set([])
	};
}

export const stressStore = createStressStore();