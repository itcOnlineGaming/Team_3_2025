import { writable, get } from 'svelte/store';
import type { Stressor } from './stressStore';

export interface DayEntry {
	date: string; // Format: YYYY-MM-DD
	stressors: Stressor[];
	timestamp: Date;
}

export interface CalendarData {
	[yearMonth: string]: { // Format: YYYY-MM
		[day: string]: DayEntry; // Format: DD
	};
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

// Helper function to get year-month key
function getYearMonthKey(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}`;
}

// Helper function to get day key
function getDayKey(date: Date): string {
	return String(date.getDate()).padStart(2, '0');
}

// Load from localStorage
function loadCalendarData(): CalendarData {
	if (typeof window === 'undefined') return {};
	
	const stored = localStorage.getItem('emotional-app-calendar');
	if (!stored) return {};
	
	try {
		const parsed = JSON.parse(stored);
		// Convert timestamp strings back to Date objects
		Object.keys(parsed).forEach(yearMonth => {
			Object.keys(parsed[yearMonth]).forEach(day => {
				parsed[yearMonth][day].timestamp = new Date(parsed[yearMonth][day].timestamp);
				parsed[yearMonth][day].stressors = parsed[yearMonth][day].stressors.map((s: any) => ({
					...s,
					timestamp: new Date(s.timestamp)
				}));
			});
		});
		return parsed;
	} catch (e) {
		console.error('Failed to load calendar data:', e);
		return {};
	}
}

// Save to localStorage
function saveCalendarData(data: CalendarData): void {
	if (typeof window === 'undefined') return;
	
	try {
		localStorage.setItem('emotional-app-calendar', JSON.stringify(data));
	} catch (e) {
		console.error('Failed to save calendar data:', e);
	}
}

function createCalendarStore() {
	const { subscribe, set, update } = writable<CalendarData>(loadCalendarData());

	return {
		subscribe,
		
		// Save today's stressors
		saveTodayEntry: (stressors: Stressor[]) => {
			const today = new Date();
			const yearMonth = getYearMonthKey(today);
			const day = getDayKey(today);
			const dateStr = formatDate(today);
			
			update(data => {
				if (!data[yearMonth]) {
					data[yearMonth] = {};
				}
				
				data[yearMonth][day] = {
					date: dateStr,
					stressors: stressors,
					timestamp: today
				};
				
				saveCalendarData(data);
				return data;
			});
		},
		
		// Save entry for specific date
		saveEntry: (date: Date, stressors: Stressor[], override: boolean = false) => {
			const yearMonth = getYearMonthKey(date);
			const day = getDayKey(date);
			const dateStr = formatDate(date);
			
			update(data => {
				if (!data[yearMonth]) {
					data[yearMonth] = {};
				}
				
				// Check if entry exists and override is false
				if (data[yearMonth][day] && !override) {
					console.warn('Entry already exists for this date. Set override to true to replace.');
					return data;
				}
				
				data[yearMonth][day] = {
					date: dateStr,
					stressors: stressors,
					timestamp: new Date()
				};
				
				saveCalendarData(data);
				return data;
			});
		},
		
		// Get entry for specific date - FIXED to not cause infinite loop
		getEntry: (date: Date): DayEntry | null => {
			const data = get({ subscribe }); // Use get() instead of subscribe()
			const yearMonth = getYearMonthKey(date);
			const day = getDayKey(date);
			return data[yearMonth]?.[day] || null;
		},
		
		// Get all entries for a specific month
		getMonthEntries: (year: number, month: number): DayEntry[] => {
			const data = get({ subscribe });
			const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
			const monthData = data[yearMonth];
			
			if (monthData) {
				return Object.values(monthData);
			}
			return [];
		},
		
		// Delete entry for specific date
		deleteEntry: (date: Date) => {
			const yearMonth = getYearMonthKey(date);
			const day = getDayKey(date);
			
			update(data => {
				if (data[yearMonth]?.[day]) {
					delete data[yearMonth][day];
					
					// Clean up empty months
					if (Object.keys(data[yearMonth]).length === 0) {
						delete data[yearMonth];
					}
					
					saveCalendarData(data);
				}
				return data;
			});
		},
		
		// Clear entire month
		clearMonth: (year: number, month: number) => {
			const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
			
			update(data => {
				delete data[yearMonth];
				saveCalendarData(data);
				return data;
			});
		},
		
		// Clear all data
		clearAll: () => {
			set({});
			saveCalendarData({});
		},
		
		// Check if entry exists for date
		hasEntry: (date: Date): boolean => {
			const data = get({ subscribe });
			const yearMonth = getYearMonthKey(date);
			const day = getDayKey(date);
			return !!(data[yearMonth]?.[day]);
		}
	};
}

export const calendarStore = createCalendarStore();