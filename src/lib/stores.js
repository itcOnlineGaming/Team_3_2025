import { writable } from 'svelte/store';

// Shared stores for the selected option and its text
export const selectedOption = writable(null);
export const selectedText = writable(null);