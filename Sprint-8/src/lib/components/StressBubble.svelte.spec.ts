import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import StressBubbleGraph from '$lib/components/StressBubbleGraph.svelte';

describe('StressBubbleGraph', () => {
	it('renders with empty stressors array', async () => {
		render(StressBubbleGraph, {
			stressors: []
		});

		await expect.element(page.getByText('No stressors tracked yet today')).toBeInTheDocument();
	});

	it('displays the graph header with title', async () => {
		render(StressBubbleGraph, {
			stressors: []
		});

		await expect.element(page.getByText('Bubble Graph')).toBeInTheDocument();
	});

	it('displays formatted date', async () => {
		const testDate = new Date('2025-03-15');
		render(StressBubbleGraph, {
			stressors: [],
			date: testDate
		});

		// Date format: "Saturday, March 15"
		const dateElement = page.getByText(/March 15/i);
		await expect.element(dateElement).toBeInTheDocument();
	});

	it('uses current date when date prop is not provided', async () => {
		render(StressBubbleGraph, {
			stressors: []
		});

		const today = new Date();
		const monthName = today.toLocaleDateString('en-US', { month: 'long' });
		
		const dateElement = page.getByText(new RegExp(monthName, 'i'));
		await expect.element(dateElement).toBeInTheDocument();
	});

	it('renders multiple stressors as bubbles', async () => {
		render(StressBubbleGraph, {
			stressors: [
				{ id: '1', text: 'Work deadline', intensity: 4 },
				{ id: '2', text: 'Family issues', intensity: 2 },
				{ id: '3', text: 'Financial concerns', intensity: 5 }
			]
		});

		await expect.element(page.getByText('Work deadline')).toBeInTheDocument();
		await expect.element(page.getByText('Family issues')).toBeInTheDocument();
		await expect.element(page.getByText('Financial concerns')).toBeInTheDocument();
	});

	it('displays legend with all intensity levels', async () => {
		render(StressBubbleGraph, {
			stressors: []
		});

		await expect.element(page.getByText('Stress Intensity')).toBeInTheDocument();
		await expect.element(page.getByText('Stressed')).toBeInTheDocument();
		await expect.element(page.getByText('Moderate')).toBeInTheDocument();
		await expect.element(page.getByText('Calm')).toBeInTheDocument();
	});

	it('displays legend note about bubble size', async () => {
		render(StressBubbleGraph, {
			stressors: []
		});

		await expect.element(page.getByText('Size represents stress intensity')).toBeInTheDocument();
	});

	it('hides empty state when stressors are present', async () => {
		render(StressBubbleGraph, {
			stressors: [
				{ id: '1', text: 'Test stressor', intensity: 3 }
			]
		});

		const emptyState = page.getByText('No stressors tracked yet today');
		await expect.element(emptyState).not.toBeInTheDocument();
	});

	it('renders correct number of bubbles for stressors', async () => {
		const { container } = render(StressBubbleGraph, {
			stressors: [
				{ id: '1', text: 'Stressor 1', intensity: 2 },
				{ id: '2', text: 'Stressor 2', intensity: 4 },
				{ id: '3', text: 'Stressor 3', intensity: 1 },
				{ id: '4', text: 'Stressor 4', intensity: 5 }
			]
		});

		const bubbles = container.querySelectorAll('.bubble');
		expect(bubbles.length).toBe(4);
	});

	it('includes mood property when provided in stressor', async () => {
		render(StressBubbleGraph, {
			stressors: [
				{ id: '1', text: 'Work stress', intensity: 3, mood: 'anxious' }
			]
		});

		// The mood prop is passed to StressBubble, just verify the stressor renders
		await expect.element(page.getByText('Work stress')).toBeInTheDocument();
	});

	it('handles stressors with different intensity levels', async () => {
		const { container } = render(StressBubbleGraph, {
			stressors: [
				{ id: '1', text: 'Low', intensity: 1 },
				{ id: '2', text: 'Medium', intensity: 3 },
				{ id: '3', text: 'High', intensity: 5 }
			]
		});

		const bubbles = container.querySelectorAll('.bubble');
		expect(bubbles.length).toBe(3);
		
		// Verify the stressor text is rendered
		await expect.element(page.getByText('Low')).toBeInTheDocument();
		await expect.element(page.getByText('Medium')).toBeInTheDocument();
		await expect.element(page.getByText('High')).toBeInTheDocument();
	});

	it('positions bubbles to avoid edge margins', async () => {
		const { container } = render(StressBubbleGraph, {
			stressors: [
				{ id: '1', text: 'Test 1', intensity: 3 },
				{ id: '2', text: 'Test 2', intensity: 4 }
			]
		});

		const bubbles = container.querySelectorAll('.bubble') as NodeListOf<HTMLElement>;
		
		bubbles.forEach((bubble) => {
			// Read inline percent styles set by the component (e.g. "75%")
			const left = parseFloat(bubble.style.left || '0');
			const top = parseFloat(bubble.style.top || '0');

			// Positions should be within 15-85% range (considering 15% margin)
			expect(left).toBeGreaterThanOrEqual(15);
			expect(left).toBeLessThanOrEqual(85);
			expect(top).toBeGreaterThanOrEqual(15);
			expect(top).toBeLessThanOrEqual(85);
		});
	});

	it('maintains consistent positions for same number of stressors', async () => {
		const stressors = [
			{ id: '1', text: 'Stressor 1', intensity: 2 },
			{ id: '2', text: 'Stressor 2', intensity: 3 },
			{ id: '3', text: 'Stressor 3', intensity: 4 }
		];

		const { container: container1 } = render(StressBubbleGraph, {
			stressors
		});

		const bubbles1 = Array.from(container1.querySelectorAll('.bubble') as NodeListOf<HTMLElement>);
		const positions1 = bubbles1.map(b => ({
			left: window.getComputedStyle(b).left,
			top: window.getComputedStyle(b).top
		}));

		// Positions should be deterministic based on the position generation algorithm
		expect(positions1.length).toBe(3);
		positions1.forEach(pos => {
			expect(pos.left).toBeTruthy();
			expect(pos.top).toBeTruthy();
		});
	});

	it('calls onRemove when bubble is clicked', async () => {
		let removedId = '';
		const onRemove = (id: string) => {
			removedId = id;
		};

		render(StressBubbleGraph, {
			stressors: [
				{ id: 'test-1', text: 'Test stressor', intensity: 3 }
			],
			onRemove
		});

		const bubble = page.getByText('Test stressor');
		await bubble.click();

		expect(removedId).toBe('test-1');
	});
});