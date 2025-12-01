<script>
	import { base } from '$app/paths';

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

<div class="container">
  <div class="help-popup">
		<div class="help-content">
      <h3>Steps:</h3>
        <ol>
          <li>Please fill out the Feedback Form</li>
          <li>Return Back to Home</li>
        </ol>
    </div>
  </div>
</div>

<div class="forum-conclusion">

	<div class="header">
		<h1>Feedback</h1>
		<p>Thank you for using our demo application. <br> Please let us know your thoughts down below!</p>
	</div>
	
	<div class="main-content">
		<div class="smiley-container">
			<button class="big-smiley" on:click={getRandomQuote}>Change Quote</button>
		</div>

		<div class="quote-section">
			<div class="quote-card">
				<p>"{currentQuote}"</p>
			</div>
		</div>
	</div>
	
	<div class="navigation">
		<!--<button on:click={openPopup}>Share Feedback</button>-->
		<a href="https://forms.office.com/e/eBZMHfxRjq" target="_blank"><button class="back-btn">Feedback Form</button></a>
		<a href="{base}/"><button class="back-btn">← Back to Home</button></a>
	</div>
</div>

<!-- Simple popup modal -->
<!--{#if showPopup}
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
{/if}-->

<style>

	.container {
		margin: 0;
		padding: 0;
		position: relative;
	}
	
	/* Main container */
	.forum-conclusion {
		margin: 0;
		padding: 2rem;
		min-height: 100vh;
		width: 100vw;
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		background-image: url('/Images/background art.png') ;
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
		overflow: hidden;
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
		box-sizing: border-box;
	}
	
	/* Header styles */

	.header {
		z-index: 5;
		background: rgba(255, 255, 255, 0.572);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 20px;
		padding-bottom: 5px;
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
	}

	.header h1 {
		font-size: 3rem;
		color: #000000;
		font-weight: 700;
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
		margin-bottom: auto;
		z-index: 2;
		
	}
	
	.header p {
		font-size: 2rem;
		-webkit-text-stroke: #000 0.1px;
		color: #333;
		z-index: 2;
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
	}
	
	/* Main content */
	.main-content {
		position: relative;
		z-index: 2;
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
	}
	
	/* Big smiley button */
	.smiley-container {
		position: relative;
		margin: 2rem 0;
	}
	
	.big-smiley {
		font-size: 2rem;
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
		background: linear-gradient(135deg, #ffe880 0%, #c94600 100%);
		cursor: pointer;
		width: 200px;
		height: 200px;
		border-radius: 50%;
		display: wrap;
		align-items: center;
		margin: 0 auto;
		transition: transform 0.3s ease;
		color: white;
		position: relative;
		overflow: visible;
	}
	
	.big-smiley::before {
		content: '';
		position: relative;
		bottom: -80px;
		left: 50%;
		transform: translateX(-50%);
		width: 120%;
		height: 60px;
		background: radial-gradient(ellipse at center, rgba(255, 255, 200, 0.5) 0%, transparent 70%);
		filter: blur(20px);
		z-index: -1;
		pointer-events: none;
	}
	
	.big-smiley:hover {
		transform: scale(1.05);
	}
	
	/* Quote section */
	.quote-section {
		margin: 4rem 0;
		color: #000;
		position: relative;
		z-index: 2;
		padding-left: 20rem;
		padding-right: 20rem;
	}
	
	.quote-card {
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 2rem;
		margin-bottom: 2rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}
	
	.quote-card p {
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
		font-size: 1.2rem;
		line-height: 1.6;
		margin: 0;
		color: #000;
	}
	
	/* Navigation */
	.navigation {
		position: relative;
		z-index: 10;
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 3rem;
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
	}
	
	/* Back button */
	.back-btn {
		display: inline-block;
		padding: 1rem 2rem;
		background: rgba(245, 213, 213, 0.9);
		color: #333;
		text-decoration: none;
		border-radius: 50px;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		font-weight: 600;
		font-size: 1.1rem;
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}
	
	.back-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	}

	.help-popup {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-width: 250px;
}

.help-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
  font-family: BlinkMacSystemFont, -apple-system, sans-serif;
}

.help-content ol {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

.help-content li {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.help-content li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .help-popup {
    display: none;
  }
}

</style>