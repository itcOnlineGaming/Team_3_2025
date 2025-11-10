import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ImportanceRating from '$lib/components/ImportanceRating.svelte';

describe('ImportanceRating', () => {
	it('renders without label when not provided', async () => {
		render(ImportanceRating, {
			id: 'test-rating'
		});

		const label = page.getByText('Rate this item');
		await expect.element(label).not.toBeInTheDocument();
	});

	it('starts with no selection when value is 0', async () => {
		render(ImportanceRating, {
			id: 'test-rating',
			value: 0
		});

		for (let i = 1; i <= 5; i++) {
			const box = page.getByTestId(`rating-${i}`);
			await expect.element(box).not.toHaveClass('selected');
		}
	});

	it('shows selected state for initial value', async () => {
		render(ImportanceRating, {
			id: 'test-rating',
			value: 3
		});

		const selectedBox = page.getByTestId('rating-3');
		await expect.element(selectedBox).toHaveClass('selected');
	});

	it('updates selection when clicking a rating box', async () => {
		let changeDetail: any = null;

		render(ImportanceRating, {
			id: 'test-rating',
			value: 0,
			onchange: (detail) => {
				changeDetail = detail;
			}
		});

		const box3 = page.getByTestId('rating-3');
		await box3.click();

		expect(changeDetail).toEqual({ id: 'test-rating', value: 3 });
		await expect.element(box3).toHaveClass('selected');
	});

	it('allows changing selection from one rating to another', async () => {
		let changeDetail: any = null;

		render(ImportanceRating, {
			id: 'test-rating',
			value: 2,
			onchange: (detail) => {
				changeDetail = detail;
			}
		});

		// Initially box 2 is selected
		await expect.element(page.getByTestId('rating-2')).toHaveClass('selected');

		// Click box 5
		const box5 = page.getByTestId('rating-5');
		await box5.click();

		expect(changeDetail).toEqual({ id: 'test-rating', value: 5 });
		await expect.element(box5).toHaveClass('selected');
		await expect.element(page.getByTestId('rating-2')).not.toHaveClass('selected');
	});

	it('handles all rating values from 1 to 5', async () => {
		const changeEvents: any[] = [];

		render(ImportanceRating, {
			id: 'test-rating',
			value: 0,
			onchange: (detail) => {
				changeEvents.push(detail);
			}
		});

		// Click each rating in sequence
		for (let i = 1; i <= 5; i++) {
			const box = page.getByTestId(`rating-${i}`);
			await box.click();
		}

		expect(changeEvents).toEqual([
			{ id: 'test-rating', value: 1 },
			{ id: 'test-rating', value: 2 },
			{ id: 'test-rating', value: 3 },
			{ id: 'test-rating', value: 4 },
			{ id: 'test-rating', value: 5 }
		]);
	});

	it('works without onchange callback', async () => {
		render(ImportanceRating, {
			id: 'test-rating',
			value: 0
		});

		const box3 = page.getByTestId('rating-3');
		await box3.click();

		// Should not throw error and should still update visually
		await expect.element(box3).toHaveClass('selected');
	});
});