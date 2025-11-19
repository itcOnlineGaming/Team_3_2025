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
  <div class="content-wrapper">
    {#if !started}
      <div class="intro">
        <h1>You seem stressed</h1>
        <p>Its important to stay mindful, lets take a moment to meditae</p>
        <div class="meditation-card">
          <h2>5-10 min<br>meditaion</h2>
        </div>
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
    max-width: 600px;
  }

  .intro {
    text-align: center;
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
    text-transform: lowercase;
  }

  .button-container {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    display: flex;
    justify-content: space-between;
    max-width: calc(100% - 4rem);
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
</style>
