<script lang="ts">
  import { base } from '$app/paths';
  import Meditation from '$lib/components/MeditationComponent/Meditation.svelte';

  let started = false;
  let completed = false;

  function startMeditation() {
    started = true;
  }

  function handleComplete() {
    completed = true;
  }
</script>

<div class="container">
  <div class="help-popup">
		<div class="help-content">
      <h3>Steps:</h3>
        <ol>
          <li>Click Start to Begin the Meditation</li>
          <li>Click Skip To Proceed to Feedback</li>
        </ol>
    </div>
  </div>

  <div class="content-wrapper">
    {#if !started}
      <div class="intro">
        <h2>Would You Like To Meditate?</h2>
        <p>It's important to stay mindful, take a moment to meditate</p>
        </div>
        <div class="meditation-card">
          <h2>2 Minute<br>Meditation</h2>
        
      </div>
    {:else}
      <Meditation on:complete={handleComplete} />
    {/if}
  </div>

  <div class="button-container">
    <button class="action-button skip" on:click={() => window.location.href = `${base}/Conclusion`}>skip</button>

    {#if !started}
      <button class="action-button start" on:click={startMeditation}>start</button>
    {/if}

    {#if completed}
      <button class="action-button start" on:click={() => window.location.href = `${base}/Conclusion`}>continue</button>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    position: relative;
    background-image: url('/Images/background art.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  .content-wrapper {
    z-index: 2;
    width: 100%;
    max-width: 800px;
  }

  .intro {
    margin-top: 10rem;
    text-align: center;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		padding-bottom: 1rem;
		margin-bottom: 2rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}
	
	.intro p {
		font-style: BlinkMacSystemFont, -apple-system, sans-serif;
		font-size: 1.2rem;
		line-height: 1.6;
		margin: 0;
		color: #000;
	}

  h1 {
    font-size: 3rem;
    color: #000;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 3rem;
    line-height: 1.6;
  }

  .meditation-card {
    background: linear-gradient(135deg, #d4723c 0%, #c8632e 100%);
    border-radius: 50%;
    width: 300px;
    height: 300px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .meditation-card::before {
    content: '';
    position: absolute;
    bottom: -150px;
    left: 50%;
    transform: translateX(-50%);
    width: 120%;
    height: 80px;
    background: radial-gradient(ellipse at center, rgba(255, 255, 200, 0.6) 0%, transparent 70%);
    filter: blur(20px);
  }

  .meditation-card h2 {
    color: white;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.3;
  }

  .button-container {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 40rem;
    z-index: 10;
  }

  .action-button {
    padding: 1rem 3rem;
    color: #333;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 1.1rem;
    text-transform: lowercase;
  }

  .action-button.skip {
    background-color: rgba(245, 213, 213, 0.9);
  }

  .action-button.start {
    background-color: #ff6b35;
    color: white;
  }

  .action-button:hover {
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
