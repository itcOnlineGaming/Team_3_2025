import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1 headings', async () => {
		render(Page);

		// Check for the actual h1 text in the component
		const backgroundHeading = page.getByRole('heading', { level: 1, name: /Background/i });
		await expect.element(backgroundHeading).toBeInTheDocument();
		
		const prototypeHeading = page.getByRole('heading', { level: 1, name: /Emotional App Prototype/i });
		await expect.element(prototypeHeading).toBeInTheDocument();
	});

	it('should render the app description', async () => {
		render(Page);

		await expect.element(page.getByText(/Track your emotional well-being/i)).toBeInTheDocument();
	});

	it('should render the Go to App button', async () => {
		render(Page);

		const button = page.getByRole('link', { name: /Go to App!/i });
		await expect.element(button).toBeInTheDocument();
	});

	it('button should link to forum page', async () => {
		const { container } = render(Page);

		const link = container.querySelector('a.submit-button') as HTMLAnchorElement;
		expect(link.href).toContain('/forum');
	});
});