<script>
	// Simple array of quotes
	const quotes = [
		"No matter how weak or unworthy you feel... keep your heart burning, grit your teeth and move forward  - Kyojuro Rengoku's",
		"The purpose of our lives is to be happy. - Dalai Lama",
		"Choose to be happy. It is a good look on you! - Anonymous",
		"Happiness is a warm puppy. - Charles M. Schulz",
		"Life is really simple, but we insist on making it complicated. - Confucius",
		"No Matter how hard or impossible it is, never lose sight of your goal. - Monkey D. Luffy"
	];

	// Current quote (reactive variable)
	let currentQuote = quotes[0];
	
	// Popup variables
	let showPopup = false;
	let userFeedback = '';
	let feelBetter = null;
	
	// Simple function to get random quote
	function getRandomQuote() {
		const randomIndex = Math.floor(Math.random() * quotes.length);
		currentQuote = quotes[randomIndex];
	}
	
	// Function to open popup
	function openPopup() {
		showPopup = true;
	}
	
	// Function to close popup
	function closePopup() {
		showPopup = false;
		userFeedback = '';
		feelBetter = null;
	}
	
	// Function to save input to JSON file
	async function saveToJson() {
		if (userFeedback.trim() === '') {
			alert('Please enter some feedback before saving!');
			return;
		}
		
		if (feelBetter === null) {
			alert('Please answer if you feel better!');
			return;
		}
		
		const data = {
			timestamp: new Date().toISOString(),
			feedback: userFeedback.trim(),
			feelBetter: feelBetter,
			page: 'conclusion'
		};
		
		try {
			// Try to update FEEDBACK.json via API endpoint
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			});
			
			if (response.ok) {
				alert('Feedback saved to FEEDBACK.json successfully!');
				closePopup();
			} else {
				throw new Error('Failed to save feedback');
			}
		} catch (error) {
			console.error('Error saving feedback:', error);
			// Fallback to localStorage if API fails
			const existingData = JSON.parse(localStorage.getItem('feedbackData') || '[]');
			existingData.push(data);
			localStorage.setItem('feedbackData', JSON.stringify(existingData, null, 2));
			alert('Feedback saved to browser storage (FEEDBACK.json update failed)');
			closePopup();
		}
	}
</script>

<div class="forum-conclusion">
	<div class="header">
		<h1>Forum Conclusion</h1>
		<p>THANK YOU FOR SHARING YOUR THOUGHTS!</p>
	</div>
	
	<div class="main-content">
		<div class="smiley-container">
			<button class="big-smiley" on:click={getRandomQuote}>:)</button>
		</div>

		<div class="quote-section">
			<div class="quote-card">
				<p>"{currentQuote}"</p>
			</div>
		</div>
	</div>
	
	<div class="navigation">
		<button on:click={openPopup}>Share Feedback</button>
		<a href="/" class="back-btn">← Back to Home</a>
	</div>
</div>

<!-- Simple popup modal -->
{#if showPopup}
	<div>
		<div>
			<h3>Share Your Feedback</h3>
			
			<label for="feedback">Feedback:</label><br>
			<textarea id="feedback" bind:value={userFeedback} placeholder="Enter your feedback here..." rows="5" cols="50"></textarea>
			<br><br>
			
			<label>Do you feel better?</label><br>
			<input type="radio" id="yes" name="feelBetter" bind:group={feelBetter} value={true} />
			<label for="yes">Yes</label><br>
			<input type="radio" id="no" name="feelBetter" bind:group={feelBetter} value={false} />
			<label for="no">No</label>
			<br><br>
			
			<button on:click={saveToJson}>Save Feedback</button>
			<button on:click={closePopup}>Cancel</button>
		</div>
	</div>
{/if}

<style>
	/* Main container */
	.forum-conclusion {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
		color: white;
		text-align: center;
	}
	
	/* Header styles */
	.header h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
		color: #000
	}
	
	.header p {
		font-size: 1.2rem;
		margin-bottom: 3rem;
	}
	
	/* Big smiley button */
	.big-smiley {
		font-size: 8rem;
		background: none;
		border: none;
		cursor: pointer;
		margin: 2rem 0;
		transition: transform 0.3s ease;
	}
	
	.big-smiley:hover {
		transform: scale(1.1);
	}
	
	/* Quote section */
	.quote-section {
		margin: 3rem 0;
		color: #000;
	}
	
	.quote-card {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 15px;
		padding: 2rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: #000;
	}
	
	.quote-card p {
		font-style: italic;
		font-size: 1.2rem;
		line-height: 1.6;
		margin: 0;
		color: #000;
	}
	
	/* Back button */
	.back-btn {
		display: inline-block;
		padding: 1rem 2rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		text-decoration: none;
		border-radius: 25px;
		margin-top: 3rem;
		transition: all 0.3s ease;
		color: #000;
	}
	
	.back-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}
</style>