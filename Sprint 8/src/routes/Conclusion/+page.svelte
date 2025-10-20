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
	
	// Simple function to get random quote
	function getRandomQuote() {
		const randomIndex = Math.floor(Math.random() * quotes.length);
		currentQuote = quotes[randomIndex];
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
		<a href="/" class="back-btn">← Back to Home</a>
	</div>
</div>

<style>
	/* Main container */
	.forum-conclusion {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		background: linear-gradient(135deg, #ff8c00 0%, rgb(255, 251, 0) 100%);
		min-height: 100vh;
		color: white;
		text-align: center;
	}
	
	/* Header styles */
	.header h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
		color: #ffd700;
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
	}
	
	.quote-card {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 15px;
		padding: 2rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	.quote-card p {
		font-style: italic;
		font-size: 1.2rem;
		line-height: 1.6;
		margin: 0;
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
	}
	
	.back-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}
</style>