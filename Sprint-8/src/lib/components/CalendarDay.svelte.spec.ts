import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CalendarDay from '$lib/components/CalendarDay.svelte';
import type { DayEntry } from '$lib/stores/calendarStore';

describe('CalendarDay', () => {
	it('renders day number correctly', async () => {
		render(CalendarDay, {
			dayNumber: 15,
			entry: null,
			isCurrentMonth: true,
			isToday: false
		});

		await expect.element(page.getByText('15')).toBeInTheDocument();
	});

	it('applies current-month class when isCurrentMonth is true', async () => {
		const { container } = render(CalendarDay, {
			dayNumber: 20,
			entry: null,
			isCurrentMonth: true,
			isToday: false
		});

		const button = container.querySelector('.calendar-day');
		expect(button?.classList.contains('current-month')).toBe(true);
	});

	it('does not apply current-month class when isCurrentMonth is false', async () => {
		const { container } = render(CalendarDay, {
			dayNumber: 30,
			entry: null,
			isCurrentMonth: false,
			isToday: false
		});

		const button = container.querySelector('.calendar-day');
		expect(button?.classList.contains('current-month')).toBe(false);
	});

	it('applies today class when isToday is true', async () => {
		const { container } = render(CalendarDay, {
			dayNumber: 1,
			entry: null,
			isCurrentMonth: true,
			isToday: true
		});

		const button = container.querySelector('.calendar-day');
		expect(button?.classList.contains('today')).toBe(true);
	});

	it('applies has-entry class when entry exists', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'Test stressor', intensity: 3 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 10,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const button = container.querySelector('.calendar-day');
		expect(button?.classList.contains('has-entry')).toBe(true);
	});

	it('does not show indicators when entry is null', async () => {
		const { container } = render(CalendarDay, {
			dayNumber: 5,
			entry: null,
			isCurrentMonth: true,
			isToday: false
		});

		const indicators = container.querySelector('.indicator-row');
		expect(indicators).toBeNull();
	});

	it('shows indicators when entry has stressors', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'Stressor 1', intensity: 3 },
				{ id: '2', text: 'Stressor 2', intensity: 4 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 12,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const indicators = container.querySelectorAll('.mini-indicator');
		expect(indicators.length).toBe(2);
	});

	it('shows maximum of 3 indicators', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'Stressor 1', intensity: 2 },
				{ id: '2', text: 'Stressor 2', intensity: 3 },
				{ id: '3', text: 'Stressor 3', intensity: 4 },
				{ id: '4', text: 'Stressor 4', intensity: 5 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 18,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const indicators = container.querySelectorAll('.mini-indicator');
		expect(indicators.length).toBe(3);
	});

	it('shows +N count when more than 3 stressors', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'Stressor 1', intensity: 2 },
				{ id: '2', text: 'Stressor 2', intensity: 3 },
				{ id: '3', text: 'Stressor 3', intensity: 4 },
				{ id: '4', text: 'Stressor 4', intensity: 5 },
				{ id: '5', text: 'Stressor 5', intensity: 3 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 25,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const moreCount = container.querySelector('.more-count');
		expect(moreCount?.textContent).toBe('+2');
	});

	it('calculates correct color for low stress (intensity < 1.5)', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'Low stress', intensity: 1 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 7,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const indicator = container.querySelector('.mini-indicator') as HTMLElement;
		expect(indicator?.style.backgroundColor).toBe('rgb(154, 205, 50)'); // #9ACD32
	});

	it('calculates correct color for moderate stress (intensity 2.5-3.5)', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'Moderate stress', intensity: 3 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 14,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const indicator = container.querySelector('.mini-indicator') as HTMLElement;
		expect(indicator?.style.backgroundColor).toBe('rgb(255, 165, 0)'); // #FFA500
	});

	it('calculates correct color for high stress (intensity >= 4.5)', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'High stress', intensity: 5 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 21,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const indicator = container.querySelector('.mini-indicator') as HTMLElement;
		expect(indicator?.style.backgroundColor).toBe('rgb(233, 30, 99)'); // #E91E63
	});

	it('calculates average intensity correctly', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'Stress 1', intensity: 2 },
				{ id: '2', text: 'Stress 2', intensity: 4 },
				{ id: '3', text: 'Stress 3', intensity: 3 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 28,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		// Average is 3, should be orange (#FFA500)
		const indicator = container.querySelector('.mini-indicator') as HTMLElement;
		expect(indicator?.style.backgroundColor).toBe('rgb(255, 165, 0)');
	});

	it('calls onclick handler when clicked', async () => {
		let clicked = false;
		const handleClick = () => {
			clicked = true;
		};

		const { container } = render(CalendarDay, {
			dayNumber: 16,
			entry: null,
			isCurrentMonth: true,
			isToday: false,
			onclick: handleClick
		});

		const button = container.querySelector('.calendar-day') as HTMLButtonElement;
		await button.click();

		expect(clicked).toBe(true);
	});

	it('includes stressor count in aria-label', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'Stress 1', intensity: 2 },
				{ id: '2', text: 'Stress 2', intensity: 3 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 9,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const button = container.querySelector('.calendar-day') as HTMLButtonElement;
		expect(button.getAttribute('aria-label')).toBe('Day 9, 2 stressors');
	});

	it('has basic aria-label without entry', async () => {
		const { container } = render(CalendarDay, {
			dayNumber: 11,
			entry: null,
			isCurrentMonth: true,
			isToday: false
		});

		const button = container.querySelector('.calendar-day') as HTMLButtonElement;
		expect(button.getAttribute('aria-label')).toBe('Day 11');
	});

	it('sets title attribute on indicators', async () => {
		const entry: DayEntry = {
			date: new Date(),
			stressors: [
				{ id: '1', text: 'My stressor text', intensity: 3 }
			]
		};

		const { container } = render(CalendarDay, {
			dayNumber: 22,
			entry,
			isCurrentMonth: true,
			isToday: false
		});

		const indicator = container.querySelector('.mini-indicator') as HTMLElement;
		expect(indicator.getAttribute('title')).toBe('My stressor text');
	});

	it('renders as button element', async () => {
		const { container } = render(CalendarDay, {
			dayNumber: 3,
			entry: null,
			isCurrentMonth: true,
			isToday: false
		});

		const element = container.querySelector('.calendar-day');
		expect(element?.tagName).toBe('BUTTON');
	});

	it('has correct button type attribute', async () => {
		const { container } = render(CalendarDay, {
			dayNumber: 8,
			entry: null,
			isCurrentMonth: true,
			isToday: false
		});

		const button = container.querySelector('.calendar-day') as HTMLButtonElement;
		expect(button.type).toBe('button');
	});
});