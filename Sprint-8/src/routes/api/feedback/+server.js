import { json } from '@sveltejs/kit';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function POST({ request }) {
	try {
		const newFeedback = await request.json();
		
		const feedbackPath = join(process.cwd(), 'FEEDBACK.json');
		
		let existingData = [];
		if (existsSync(feedbackPath)) {
			try {
				const fileContent = readFileSync(feedbackPath, 'utf-8');
				existingData = JSON.parse(fileContent);
			} catch (error) {
				console.error('Error reading FEEDBACK.json:', error);
				existingData = [];
			}
		}
		
		existingData.push(newFeedback);
		
		writeFileSync(feedbackPath, JSON.stringify(existingData, null, 2));
		
		return json({ success: true, message: 'Feedback saved successfully' });
	} catch (error) {
		console.error('Error saving feedback:', error);
		return json({ success: false, error: 'Failed to save feedback' }, { status: 500 });
	}
}